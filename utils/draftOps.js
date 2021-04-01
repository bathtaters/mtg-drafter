// Extended draft methods

const cubePacks = require('./cubePacks');
const boosterPacks = require('./boosterPacks');
const basic = require('./basic');
const { draftStatus } = require('../config/definitions');
const mtgDb = require('../config/db');


// Setup a New Draft using a settings object
async function makeNewDraft(settings) {
    console.log(JSON.stringify(settings));
    let newDraft = { players: [] };

    if ('name' in settings) newDraft.name = settings.name;

    while (newDraft.players.length < settings.playerCount) {
        newDraft.players.push({});
    }
    if (newDraft.players == []) {
        console.error('New session has no players!');
        return;
    }

    if ('cubeData' in settings) {
        newDraft.name = 'Cube Draft';
        newDraft.packs = await cubePacks(
            settings.cubeData,
            newDraft.players.length,
            settings.packSize,
            settings.packCount
        );
    } else {
        newDraft.name = settings.packLayout.join(',') + ' Draft';
        newDraft.packs = await boosterPacks(
            settings.packLayout,
            newDraft.players.length
        );
    }

    newDraft = new this(newDraft);

    newDraft.hostId = await newDraft.addPlayer().then(p => p._id);
    
    return newDraft.save();
}


// Add a player to the draft
async function draftAddPlayer(returningCookie='') {
    // Match player to slot
    let playerData;
    if (returningCookie) playerData = this.findPlayerByCookie(returningCookie);
    if (!playerData) {
        if (returningCookie)
            console.log('Returning player not found '+returningCookie+' in '+this._id);
        playerData = this.nextOpenPlayer;
    }
    if (!playerData) return console.error('No open slots in '+this._id);

    // Connect player
    playerData.connected = true;
    await this.save();
    return playerData;
}


// Start the draft
async function startDraft() {
    if (this.status != draftStatus.pre) {
        console.error(this._id+': Cannot start draft that is '+this.status);
        return 'Draft is '+this.status;
    }
    if (this.nextOpenPlayer) {
        console.error(this._id+': Cannot start draft not full');
        return 'Draft not full';
    }
    
    basic.random.shuffle(this.players);
    this.markModified('players');
    
    const result = await this.nextRound();
    return result;
}


// Move to the next round of a draft (Only called internally)
async function draftNextRound() {
    if (!this.players.every( player => !player.isDrafting))
        return 'Players are still drafting';

    // Auto-pause new rounds
    //this.isPaused = true; 

    // Increment round
    this.round++;

    // Check if game is over
    if (this.round >= this.packs.length) {
        this.round = -2;
        console.log('Draft ended');
        return 'Game is over';
    }

    // Reset picks
    this.players.forEach( player => player.pick = 0 );
    await this.save();
    console.log('Started round: '+this.round);
    return 0;
}


// Open the next pack
async function playerPassPack() {
    if (this.parent().status != draftStatus.run) return 'Draft is '+this.parent().status;
    if (!this.packsHeld) return 'Waiting for more packs';
    
    this.pick++;
    
    // If it's the last pack, check if we can move on
    let isWaiting = !this.isDrafting;
    if (isWaiting)
        isWaiting = await this.parent().nextRound();

    return isWaiting ? 'Waiting for the next round' : 0;
};


// Remove card from pack and add to board
async function playerPickCard(draftId, toSideBoard=false) {

    // Remove card from draft
    const card = await this.parent().pullCard(this.currentPack, draftId);
    if (!card) {
        console.error('Card not found for: '+this._id+': '+draftId);
        return 'No card found';
    }

    // Set code for when it was picked (round*100 + 0-indexed pick)
    card.picked = 100 * (this.parent().round + 1) + this.pick;

    // Add card to player's board & pass pack
    await this.pushCard(card, toSideBoard ? 'side' : 'main');
    console.log(this.name+' <'+this.cookieId+'> pick #'+this.pick+' is '+card.uuid);
    await this.passPack();

    await this.parent().save();
    return 0;
}


// Remove card from pack
async function draftPullCard(pack, draftId) {
    const pickIndex = pack.findIndex( card => card._id == draftId );
    if (pickIndex == -1) return;
    pack[pickIndex].picked = 1;
    return pack[pickIndex];
}


// Move card from mainBoard to sideBoard
async function playerSwapBoard(draftId) {
    // Determine where card is
    let board = ['main','side'];
    let cardIndex = this.cards.main.findIndex( card => card._id == draftId );
    if (cardIndex == -1) {
        board.reverse();
        cardIndex = this.cards.side.findIndex( card => card._id == draftId );
    }
    if (cardIndex == -1) {
        console.error(draftId+' card was not found to swap for player: '+this._id);
        return 'No card found';
    }

    // Move card
    await this.pushCard(this.cards[board[0]][cardIndex], board[1]);
    await this.pullCard(this.cards[board[0]][cardIndex], board[0]);
    await this.parent().save();
    return 0;
}





module.exports = {
    newDraft: makeNewDraft,
    nextRound: draftNextRound,
    addPlayer: draftAddPlayer,
    startDraft: startDraft,
    passPack: playerPassPack,
    pickCard: playerPickCard,
    pullCard: draftPullCard,
    swapBoard: playerSwapBoard
}
