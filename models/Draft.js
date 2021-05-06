// Combine Draft & Player schema to create Draft Model
// Includes Model extensions and imports external extensions

const mtgDb = require('../config/db');
const { model } = require('mongoose');
const draftSchema = require('./DraftDefs');
const { playerSchema } = require('./Player');
const { convert, loopArray, objArrayToObj, objToArray } = require('../controllers/shared/basicUtils');
const { draftStatus, timeFormat } = require('../config/definitions');


//* --------------- DRAFT EXTENSIONS  --------------- *//

// Draft Static Methods

draftSchema.statics.disconnectAll = function(by='') {
    const logEntry = (new Date()).toLocaleString(...timeFormat)+': Server reset'+ (by ? ' by '+by : '') + '.';
    return Draft.updateMany({'players.connected': true}, {
        $set: {'players.$[i].connected': false},
        $push: {logEntries: logEntry}
    },{ arrayFilters: [{'i.connected': true}], timestamps: false }).exec();
};
draftSchema.statics.findBySessionId = function(sessionId, proj='', opt={}) {
    const objId = convert.b64ToObjId(sessionId);
    try { mtgDb.Types.ObjectId(objId); }
    catch(e) { console.error('SessionID ("'+sessionId+'") Error: '+e.message); return; }
    return Draft.findById(objId, proj, opt).exec();
};


// Draft Instance Methods

draftSchema.methods.disconnectAll = async function(by='') {
    this.players.forEach(player => player.connected = false); // disconnect obj
    await Draft.updateMany( {_id: this._id},
        { $set: {'players.$[i].connected': false } },
        { arrayFilters: [{'i.connected': true}], timestamps: false }
    ).exec(); // disconnect DB
    return this.log('All players disconnected' + (by ? ' by '+by : '') + '.');
};

draftSchema.methods.findPlayer = function(objId) {
    if (typeof objId != 'string') objId = objId.toString();
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

draftSchema.methods.pullCard = function(pack, draftId) {
    if (!pack) return;
    const pickIndex = pack.findIndex( card => card._id == draftId );
    if (pickIndex == -1) return;
    pack[pickIndex].picked = 1;
    return pack[pickIndex];
};

draftSchema.methods.log = function(entry) {
    if (!this.logEntries) return console.error(this.name + ' <'+this.sessionId+'> unable to add log entry: '+entry);
    return Draft.updateOne( {_id: this._id},
        { $push: {logEntries: (new Date()).toLocaleString(...timeFormat)+': '+entry} },
        { timestamps: false }
    ).exec();
};

// External draft methods
const draftOps = require('../controllers/draft/draftOps');
draftSchema.statics.newDraft = require('../controllers/draft/setupDraft');
draftSchema.methods.addPlayer = draftOps.addPlayer;
draftSchema.methods.startDraft = draftOps.startDraft;
draftSchema.methods.nextRound = draftOps.nextRound;





//* --------------- PLAYER EXTENSIONS --------------- *//

// Player Instance Methods

playerSchema.methods.connect = async function(by='') {
    if (this.connected) return;
    this.connected = true; // connect obj
    await Draft.updateOne( 
        { _id: this.parent()._id, 'players._id': this._id },
        { $set: {'players.$.connected': true} },
        { timestamps: false }
    ).exec(); // connect DB
    return this.parent().log(this.identifier+' connected' + (by ? ' by '+by : '') + '.');
};

playerSchema.methods.disconnect = async function(by='') {
    if (!this.connected) return;
    this.connected = false; // disconnect obj
    await Draft.updateOne(
        { _id: this.parent()._id, 'players._id': this._id },
        { $set: {'players.$.connected': false} },
        { timestamps: false }
    ).exec(); // disconnect DB
    return this.parent().log(this.identifier+' disconnected' + (by ? ' by '+by : '') + '.');
};

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

playerSchema.methods.setLandData = function(newLands) {
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

playerSchema.methods.getLandData = function(board = undefined) {
    if (board) board = board.toLowerCase();
    const landData = this.cards.basicLands.filter(data => !board || data._id.contains(board));
    return objArrayToObj(landData, '_id', 'count', false);
};

playerSchema.methods.getLandTotal = function(board = undefined) {
    if (board) board = board.toLowerCase();
    
    return this.cards.basicLands.reduce( (sum,data) =>
        (!board || data._id.includes(board)) ? sum + data.count : sum,
    0);
}

// External player methods
const playerOps = require('../controllers/draft/playerOps');
playerSchema.methods.setAutoLands = require('../controllers/draft/autoLands');
playerSchema.methods.passPack = playerOps.passPack;
playerSchema.methods.pickCard = playerOps.pickCard;
playerSchema.methods.swapBoard = playerOps.swapBoard;


// Build Model
const Draft = model('Draft', draftSchema, 'sessions');
module.exports = Draft;