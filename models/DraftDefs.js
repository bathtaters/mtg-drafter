/*
Session object for a Draft -- Exports Schemas
*/

const mtgDb = require('../config/db');
const { Schema } = require('mongoose');
const { playerSchema, packCardSchema } = require('./Player');
const { draftStatus } = require('../config/definitions');


// Draft Model:
const draftSchema = new mtgDb.Schema({
    _id: { type: String, alias: 'sessionId' },
    name: { type: String, default: 'Draft' },
    url: String,
    hostId: { type: Schema.Types.ObjectId, ref: 'Draft.players' },
    players: [ playerSchema ],
    packs: [ [ [ packCardSchema ] ] ],
    round: { type: Number, default: -1 },
    isPaused: { type: Boolean, default: false },
    logEntries: [ String ]
}, {timestamps: true})

// Draft Virtuals
draftSchema.virtual('updatedAtAgg').get( function(){
    // Latest of all 'updatedAt' timestamps (Doc + subDocs)
    return new Date(Math.max(
        this.updatedAt,
        ...this.players.map(({updatedAt})=>updatedAt))
    );
});
draftSchema.virtual('direction').get( function(){
    const round = this.round
    return (this.round % 2) ? 1 : -1;
});
draftSchema.virtual('nextOpenPlayer').get( function(){
    return this.players.find( player => !player.connected );
})
draftSchema.virtual('currentPackSize').get( function(){
    if (this.round < 0 || this.round >= this.packs.length) return 0;
    return this.packs[this.round][0].length;
})
draftSchema.virtual('status').get( function(){
    if (this.round == -1) return draftStatus.pre;
    if (this.round == -2) return draftStatus.post;
    if (this.round > -1 && this.round < this.packs.length)
        return draftStatus[this.isPaused ? 'pause' : 'run'];
    console.error('Invalid draft round: '+this.round);
    return draftStatus.error;
});




// HOOK: Set 'position' when moving/adding player
draftSchema.pre('validate', function(next) {
    if (this.isModified('players'))
        this.players.forEach( (player, index) => player.position = index );
    next();
})

// Object Options
draftSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});
packCardSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});

module.exports = draftSchema;
