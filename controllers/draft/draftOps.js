// Extended draft methods
const cubePacks = require('./cubePacks');
const boosterPacks = require('./boosterPacks');
const { draftStatus } = require('../../config/definitions');
const { shuffle } = require('../shared/random');


// Add a player to the draft
async function addPlayer(returningCookie='') {
    // Match player to slot
    let playerData;
    if (returningCookie) playerData = this.findPlayerByCookie(returningCookie);
    if (!playerData) {
        if (returningCookie)
            console.log('Returning player not found '+returningCookie+' in '+this.sessionId);
        playerData = this.nextOpenPlayer;
    }
    if (!playerData) return console.error('No open slots in '+this.sessionId);

    // Connect player
    if (!playerData.connected) await this.log(playerData.identifier+' joined.');
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
    
    shuffle(this.players);
    this.markModified('players');
    await this.log('Players reordered: '+this.players.map(p=>p.identifier).join(','));
    
    const result = await this.nextRound();
    return result;
}



// Move to the next round of a draft
async function nextRound() {
    if (!this.players.every( player => !player.isDrafting))
        return 'Players are still drafting';

    // Auto-pause new rounds
    //this.isPaused = true; 

    // Increment round
    this.round++;

    // Check if game is over
    if (this.round >= this.packs.length) {
        this.round = -2;
        await this.log('Draft ended.');
        return 'Game is over';
    }

    // Reset picks
    this.players.forEach( player => player.pick = 0 );
    await this.save();
    await this.log('Started round '+(this.round+1)+'.');
    return 0;
}



module.exports = { startDraft, addPlayer, nextRound };
