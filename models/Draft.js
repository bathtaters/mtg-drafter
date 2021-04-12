// Combine Draft & Player schema to create Draft Model
// Includes Model extensions and imports external extensions

const mtgDb = require('../config/db');
const { model } = require('mongoose');
const draftSchema = require('./DraftDefs');
const { playerSchema } = require('./Player');
const { convert, loopArray, objArrayToObj, objToArray } = require('../controllers/shared/basicUtils');
const { draftStatus } = require('../config/definitions');


//* --------------- DRAFT EXTENSIONS  --------------- *//

// Draft Static Methods

draftSchema.statics.disconnectAll = function() {
    return this.updateMany(
        { 'players.connected': true },
        { '$set': {'players.$.connected': false} }
    );
};
draftSchema.statics.findBySessionId = function(sessionId, proj='', opt={}) {
    const objId = convert.b64ToObjId(sessionId);
    try { mtgDb.Types.ObjectId(objId); }
    catch(e) { console.error('SessionID ("'+sessionId+'") Error: '+e.message); return; }
    return this.findById(objId, proj, opt);
};


// Draft Instance Methods

draftSchema.methods.findPlayer = function(objId) {
    return this.players.find( player => player._id == objId );
};

draftSchema.methods.findPlayerByCookie = function(cookieId) {
    const objId = convert.b64ToObjId(cookieId);
    try { mtgDb.Types.ObjectId(objId); }
    catch(e) { console.error('PlayerID ("'+cookieId+'") Error: '+e.message); return; }
    return this.findPlayer(objId);
};

draftSchema.methods.getPack = function(packIndex) {
    if (!draftStatus.isIn(this.status)) return;
    return loopArray(this.packs[this.round], packIndex)
        .filter(c => !c.picked); // Only see unpicked cards
};

draftSchema.methods.pullCard = async function(pack, draftId) {
    if (!pack) return;
    const pickIndex = pack.findIndex( card => card._id == draftId );
    if (pickIndex == -1) return;
    pack[pickIndex].picked = 1;
    return pack[pickIndex];
};

// External draft methods
const draftOps = require('../controllers/draft/draftOps');
draftSchema.statics.newDraft = require('../controllers/draft/setupDraft');
draftSchema.methods.addPlayer = draftOps.addPlayer;
draftSchema.methods.startDraft = draftOps.startDraft;
draftSchema.methods.nextRound = draftOps.nextRound;





//* --------------- PLAYER EXTENSIONS --------------- *//

// Player Instance Methods

playerSchema.methods.pushCard = function(card, toBoard='') {
    const board = toBoard || 'main';
    this.parent().markModified('players.'+this.position+'.cards.'+board);
    this.cards[board].push(card);
};

playerSchema.methods.pullCard = function(card, fromBoard='') {
    const board = fromBoard || 'main';
    this.parent().markModified('players.'+this.position+'.cards.'+board);
    const cardIndex = this.cards[board].indexOf(card);
    if (cardIndex > -1) this.cards[board].splice(cardIndex, 1);
    else console.error('Cannot find card to pull: '+card._id);
};

playerSchema.methods.setLandData = async function(newLands) {
    for (const id in newLands) {
        const index = this.cards.basicLands.findIndex( land => land._id == id );
        if (index == -1)
            this.cards.basicLands.push({ _id: id, count: newLands[id]});
        else
            this.cards.basicLands[index].count = newLands[id];
    }
    // this.parent().markModified('players.'+this.position+'.cards.basicLands');
    return this.parent().save();
};

playerSchema.methods.getLandData = function() {
    return objArrayToObj(this.cards.basicLands, '_id', 'count', false);
};

// External player methods
const playerOps = require('../controllers/draft/playerOps');
playerSchema.methods.setAutoLands = require('../controllers/draft/autoLands');
playerSchema.methods.passPack = playerOps.passPack;
playerSchema.methods.pickCard = playerOps.pickCard;
playerSchema.methods.swapBoard = playerOps.swapBoard;


// Build Model
const Draft = model('Draft', draftSchema, 'sessions');
module.exports = Draft;