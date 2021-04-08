// Extended draft methods

const cubePacks = require('./cubePacks');
const boosterPacks = require('./boosterPacks');
const basic = require('./basic');
const { draftStatus, cardColors } = require('../config/definitions');
const mtgDb = require('../config/db');


// Setup a New Draft using a settings object
async function makeNewDraft(settings) {
    //console.log(JSON.stringify(settings));
    let newDraft = { players: [] };

    if ('name' in settings) newDraft.name = settings.name;

    while (newDraft.players.length < settings.playerCount) {
        newDraft.players.push({});
    }
    if (newDraft.players.length == 0) {
        console.error('New session has no players!');
        return;
    }

    if ('cubeData' in settings) {
        newDraft.name = settings.name || 'Cube Draft';
        newDraft.packs = await cubePacks(
            settings.cubeData,
            newDraft.players.length,
            settings.packCount,
            settings.packSize
        );
    } else {
        newDraft.name = settings.name || settings.packLayout.join(',') + ' Draft';
        newDraft.packs = await boosterPacks(
            settings.packLayout,
            newDraft.players.length
        );
    }

    if (!newDraft.packs || !newDraft.packs.length) return;
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
    if (!pack) return;
    const pickIndex = pack.findIndex( card => card._id == draftId );
    if (pickIndex == -1) return;
    pack[pickIndex].picked = 1;
    return pack[pickIndex];
}


// Move card from mainBoard to sideBoard
async function playerSwapBoard(draftId, fromSide=null) {
    // Determine where card is
    let board = ['main','side'];
    let card;
    if (!fromSide) {
        card = this.cards.main.find( card => card._id == draftId );
    }
    if (fromSide || (fromSide == null && !card)) {
        board.reverse();
        card = this.cards.side.find( card => card._id == draftId );
    }

    if (!card) {
        console.error(draftId+' card was not found to swap for player: '+this._id);
        return 0;
    }

    // Move card

    await this.pushCard(card, board[1]);
    await this.pullCard(card, board[0]);
    await this.parent().save();
    return board[1];
}

// Convert to/from basic land form data
async function playerFormToDb(v) {
    const playerPath = 'players.'+this.position+'.cards.';
    for (const key in v) {
        // Get boardName from ID
        let boardName;
        if (/^main/.test(key)) boardName = 'main';
        else if (/^side/.test(key)) boardName = 'side';
        else {
            console.log('Invalid formData board: '+key+' : '+v[key]);
            continue;
        }

        // Get index to update
        const board = this.cards.basicLands[boardName]
        const colorIndex = cardColors.indexOf(key.substr(key.length - 1).toUpperCase());
        if (colorIndex == -1) console.log('Invalid formData color: '+key+' : '+v[key]);
        else if (board[colorIndex] != v[key]) {
            // Is markModified necessary here?
            board[colorIndex] = v[key];
            this.parent().markModified(playerPath+'basicLands.'+boardName+'.'+colorIndex);
            this.parent().markModified(playerPath+'basicLands.'+boardName);
        }
        // else console.log('This color already matches');
    }
    await this.parent().save();
}
function playerDbToForm() {
    // Pull all lands from database and convert to objects
    const addLands = (landData,board) => {
        const lands = this.cards.basicLands[board]
        for(let i=0, e=lands.length; i < e; i++) {
            landData[board+'-'+cardColors[i].toLowerCase()] = lands[i] || '0';
        }
    }

    let landData = {}
    addLands(landData, 'main');
    addLands(landData, 'side');
    return landData;
}




module.exports = {
    newDraft: makeNewDraft,
    nextRound: draftNextRound,
    addPlayer: draftAddPlayer,
    startDraft: startDraft,
    passPack: playerPassPack,
    pickCard: playerPickCard,
    pullCard: draftPullCard,
    swapBoard: playerSwapBoard,
    formToDb: playerFormToDb,
    dbToForm: playerDbToForm
}
