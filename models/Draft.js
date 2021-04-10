/*
Session object of a draft

settings should be an object with:

    name = draftName
    playerCount = number (default: 8)

    for Cube:
        packSize = number (default: 15)
        packCount = number (default: 3)
        cubeData = array of cards (default: [], len >= playerCount*packCount*packSize)
    else:
        packLayout = array of setCodes (default: [], len > 0)

*/

const { Schema, model, Model } = require('mongoose');
const mtgDb = require('../config/db');
const basic = require('../utils/basic');
const draftOps = require('../utils/draftOps');
const { draftStatus, cardColors } = require('../config/definitions');

// PackCard Model:
const packCardSchema = new mtgDb.Schema({
    uuid: { type: String, ref: 'Card' },
    foil: { type: Boolean, default: false },
    picked: { type: Number, default: 0 }
});

// Basic Land Model:
const landSchema = new mtgDb.Schema({
    _id: String,
    count: { type: Number, default: 0 }
});
//const defaultLands = cardColors.filter(c => c.length == 1).reduce( c => {return {key: c};});

// Player Model:
const playerSchema = new mtgDb.Schema({
    name: {
        type: String,
        default: '',
        get: function(v){ return v || 'Player '+(this.position+1); }
     },
    position: Number,
    connected: { type: Boolean, default: false },
    pick: { type: Number, default: -1 },
    cards: {
        main: [ packCardSchema ],
        side: [ packCardSchema ],
        basicLands: [ landSchema ],
    }
});

// Draft Model:
const draftSchema = new mtgDb.Schema({
    name: { type: String, default: 'Draft' },
    hostId: { type: Schema.Types.ObjectId, ref: 'Draft.players' },
    url: String,
    players: [ playerSchema ],
    packs: [ [ [ packCardSchema ] ] ],
    round: { type: Number, default: -1 },
    isPaused: { type: Boolean, default: false }
}, {timestamps: true})

// Set 'position' when setting player
draftSchema.pre('validate', function(next) {
    if (this.isModified('players'))
        this.players.forEach( (player, index) => player.position = index );
    next();
})

// Options for retrieving as Objects
draftSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});
playerSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});
packCardSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});





// Draft virtual getters

packCardSchema.virtual('draftId').get(function(){ return this._id; });

draftSchema.virtual('sessionId').get( function(){
    return basic.sessionId.url(this._id);
});

draftSchema.virtual('direction').get( function(){
    const round = this.round
    return (this.round % 2) ? 1 : -1;
});

draftSchema.virtual('nextOpenPlayer').get( function(){
    return this.players.find( player => !player.connected );
})

draftSchema.virtual('status').get( function(){
    if (this.round == -1) return draftStatus.pre;
    if (this.round == -2) return draftStatus.post;
    if (this.round > -1 && this.round < this.packs.length)
        return draftStatus[this.isPaused ? 'pause' : 'run'];
    console.error('Invalid draft round: '+this.round);
    return draftStatus.error;
});

draftSchema.virtual('currentPackSize').get( function(){
    if (this.round < 0 || this.round >= this.packs.length) return 0;
    return this.packs[this.round][0].length;
})


// Player virtual getters

playerSchema.virtual('cookieId').get( function(){
    return basic.sessionId.url(this._id); // id for playerCookie
});

playerSchema.virtual('nextPlayer').get( function(){
    const playerIndex = this.position + this.parent().direction;
    return basic.loopArray(this.parent().players, playerIndex);
});

playerSchema.virtual('opponent').get( function(){
    const f = Math.floor(this.parent().players.length / 2);
    if (!f || this.position >= 2 * f) return;
    return this.parent().players[(this.position + f) % (2 * f)];
})

playerSchema.virtual('isDrafting').get( function(){
    return this.pick >= 0 && this.pick < this.parent().currentPackSize;
});

playerSchema.virtual('packsHeld').get( function(){
    return this.isDrafting ? this.nextPlayer.pick - this.pick + 1 : 0;
});

playerSchema.virtual('currentPack').get( function(){
    if (!this.packsHeld) return;
    const packIndex = this.parent().direction * this.pick + this.position
    return this.parent().getPack(packIndex);
});





// Draft operations

draftSchema.statics.disconnectAll = function() {
    return Draft.updateMany(
        { 'players.connected': true },
        { '$set': {'players.$.connected': false} }
    );
}

draftSchema.statics.findBySessionId = function(sessionId, proj='', opt={}) {
    let objId;
    try {
        objId = basic.sessionId.objId(sessionId);
        mtgDb.Types.ObjectId(objId); // test it converts to ObjId
    } catch(e) { console.error('SessionID ("'+sessionId+'") Error: '+e.message); return; }
    return this.findById(objId, proj, opt);
}

draftSchema.methods.findPlayer = function(objId) {
    return this.players.find( player => player._id == objId );
};

draftSchema.methods.findPlayerByCookie = function(cookieId) {
    let objId;
    try {
        objId = basic.sessionId.objId(cookieId);
        mtgDb.Types.ObjectId(objId); // test it converts to ObjId
    } catch(e) { console.error('PlayerID ("'+cookieId+'") Error: '+e.message); return; }
    return this.findPlayer(objId);
};

draftSchema.methods.getPack = function(packIndex) {
    if (!draftStatus.isIn(this.status)) return;
    return basic.loopArray(this.packs[this.round], packIndex)
        .filter(c => !c.picked); // Only see unpicked cards
};

playerSchema.methods.pushCard = function(card, toBoard='') {
    const board = toBoard || 'main';
    this.parent().markModified('players.'+this.position+'.cards.'+board);
    this.cards[board].unshift(card);
}

playerSchema.methods.pullCard = function(card, fromBoard='') {
    const board = fromBoard || 'main';
    this.parent().markModified('players.'+this.position+'.cards.'+board);
    const cardIndex = this.cards[board].indexOf(card);
    if (cardIndex > -1) this.cards[board].splice(cardIndex, 1);
    else console.error('Cannot find card to pull: '+card._id);
}


// External draft operations
draftSchema.statics.newDraft = draftOps.newDraft;
draftSchema.methods.addPlayer = draftOps.addPlayer;
draftSchema.methods.startDraft = draftOps.startDraft;
draftSchema.methods.nextRound = draftOps.nextRound;
playerSchema.methods.passPack = draftOps.passPack;
playerSchema.methods.pickCard = draftOps.pickCard;
draftSchema.methods.pullCard = draftOps.pullCard;
playerSchema.methods.swapBoard = draftOps.swapBoard;
playerSchema.methods.getLandData = draftOps.getLands;
playerSchema.methods.setLandData = draftOps.setLands;


const Draft = model('Draft', draftSchema, 'sessions');
module.exports = Draft;