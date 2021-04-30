// SubDocument of Draft -- Exports Schema

// import: packCardSchema, mtgDb
const mtgDb = require('../config/db');
const { Schema } = require('mongoose');
const { convert, loopArray } = require('../controllers/shared/basicUtils');

// Basic Land SubDoc Model
const landSchema = new mtgDb.Schema({
    _id: String,
    count: { type: Number, default: 0 }
});

// PackCard SubDoc Model
const packCardSchema = new mtgDb.Schema({
    uuid: { type: String, ref: 'Card' },
    foil: { type: Boolean, default: false },
    picked: { type: Number, default: 0 }
});
packCardSchema.virtual('draftId').get( function(){ return this._id; } );




// Player Model
const playerSchema = new mtgDb.Schema({
    name: {
        type: String,
        default: '',
        get: function(v){ return v || (this.position === -1 ? 'New Player' : 'Player '+(this.position+1)); }
     },
    position: { type: Number, default: -1 },
    connected: { type: Boolean, default: false },
    pick: { type: Number, default: -1 },
    cards: {
        main: [ packCardSchema ],
        side: [ packCardSchema ],
        basicLands: [ landSchema ],
    }
}, {timestamps: true});

// Player Virtuals
playerSchema.virtual('cookieId').get( function(){
    return convert.objIdToB64(this._id);
});
playerSchema.virtual('identifier').get( function(){
    return '"' + this.name + '" <' + this.cookieId + '>';
});
playerSchema.virtual('nextPlayer').get( function(){
    const playerIndex = this.position + this.parent().direction;
    return loopArray(this.parent().players, playerIndex);
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



// Object options
playerSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});

module.exports = { playerSchema, packCardSchema };
