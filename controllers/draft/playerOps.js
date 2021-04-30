// Extended player methods
const { draftStatus } = require('../../config/definitions');
const Card = require('../../models/Card');


// Open the next pack
async function passPack() {
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
async function pickCard(draftId, toSideBoard=false) {

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
    const cardName = await Card.findById(card.uuid).then(c=> c ? c.name : '[Missing name]');
    await this.parent().log(this.identifier+' picks "'+cardName+'" <'+card.uuid+'>'+' (Pack '+(this.parent().round+1)+', Pick '+(this.pick+1)+').');
    await this.passPack();

    await this.parent().save();
    return 0;
}


// Move card from mainBoard to sideBoard
async function swapBoard(draftId, fromSide=null) {
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


module.exports = { passPack, pickCard, swapBoard }
