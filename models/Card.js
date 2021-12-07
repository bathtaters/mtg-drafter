// Translate data from AllIdentifiers.JSON via MtgJSON

const { model } = require('mongoose');
const mtgDb = require('../config/db');
const { isUuid } = require('../controllers/shared/basicUtils');

const gathererUrl = ['https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=',''];
const scryfallUrl = ['https://api.scryfall.com/cards/','?format=image','&face=back '];

const cardSchema = new mtgDb.Schema({
    // Basic data
    _id: { type: String, alias: 'uuid' },
    name: String,
    setCode: { type: String, ref: 'Set', index: true },
    manaCost: String,
    type: String,
    text: String,
    footer: String, // create from {'power','toughness','loyalty'}
    rarity: String,
    colors: [ String ],
    types: [ String ],
    cmc: {
        type: Number,
        alias: 'convertedManaCost'
    },
    monoColor: { type: Boolean, default: false },
    
    // Image data
    scryfallId: String, // identifiers.scryfallId
    multiverseId: String, // identifiers.multiverseId
    noGath: {
        type: Boolean,
        default: false,
        alias: 'hasContentWarning'
    },
    skipArt: {
        type: Boolean,
        default: false,
    },

    // Double-faced card data
    faceName: String,
    side: String,
    otherFaceIds: [{ type: String, ref: 'Card' }],
    
    // Alternate data (Variations + Printings)
    variations: [{ type: String, ref: 'Card' }],
    printings: [{ type: String, ref: 'Card' }]
}, { autoIndex: false });

// Virtual getters
cardSchema.virtual('gathererImg').get(function(){
    return this.multiverseId ? `${gathererUrl[0]}${this.multiverseId}${gathererUrl[1]}` : this.multiverseId;
});
cardSchema.virtual('scryfallImg').get(function(){
    return this.scryfallId ? `${scryfallUrl[0]}${this.scryfallId}${scryfallUrl[1]}` : this.scryfallId;
});
cardSchema.virtual('scryfallImgBack').get(function(){
    return this.scryfallId ? (this.scryfallImg + scryfallUrl[2]) : this.scryfallId;
});
cardSchema.virtual('printedName').get(function(){
    return this.faceName || this.name;
});
cardSchema.virtual('imgUrl').get(function(){
    if (this.noGath || !this.multiverseId) {
        return this.side == 'b' ? this.scryfallImgBack : this.scryfallImg;
    }
    return this.gathererImg;
});
cardSchema.virtual('lineBrText').get(function(){
    return this.text ? this.text.split('\n') : [];
});
cardSchema.virtual('bgdColor').get(function(){
    if (this.colors.length == 1)
        return 'bgd'+this.colors[0];
    if (this.colors.length)
        return 'bgdMulti';
    if (this.types.includes('Land'))
        return 'bgdLand';
    return 'bgdNone';
});

// Set monocolor
cardSchema.path('colors').set(function(v){
    this.monoColor = v.length == 1;
    return v;
})

// Set image URLs
cardSchema.virtual('identifiers').set(function(v){
    if (v.scryfallId)
        this.scryfallId = v.scryfallId;
    if (v.multiverseId)
        this.multiverseId = v.multiverseId;
    else this.noGath = true;
});

// Set footer
cardSchema.virtual('loyalty').set(function(v){ this.footer = v; });
cardSchema.virtual('power').set(function(v){
    if (this.footer) this.footer = v + '/' + this.footer;
    else this.footer = v;
});
cardSchema.virtual('toughness').set(function(v){
    if (this.footer) this.footer = this.footer + '/' + v;
    else this.footer = v;
});

// Options for retrieving as Object
cardSchema.set('toObject', {getters: true, versionKey: false, useProjection: true});

const Card = model('Card', cardSchema);
module.exports = Card;