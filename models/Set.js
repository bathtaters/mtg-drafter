// Translate data from AllPrintings.JSON via MtgJSON

const { Schema, model } = require('mongoose');
const mtgDb = require('../config/db');
const { objToArray } = require('../controllers/shared/basicUtils');

// Booster pack layout Model:
const layoutSchema = new mtgDb.Schema({
    contents: [{
        sheetName: String, // key
        count: Number // value
    }],
    weight: Number
});

// Card sheet Model:
const sheetSchema = new mtgDb.Schema({
    name: String, // key
    cards: [{
        card: { type: String, ref: 'Card' }, // key
        weight: Number // value
    }],
    totalWeight: Number,
    foil: Boolean,
    balanceColors: Boolean
});

// Set Model:
const setSchema = new mtgDb.Schema({
    _id: { type: String, alias: 'code' },
    name: String,
    releaseDate: Date,
    block: String,
    
    // Booster data (Set virtually) 
    sheets: [ sheetSchema ],
    boosters: [ layoutSchema ],
    boostersTotalWeight: Number,
    boosterType: String
});

// Filter method for updateDb
setSchema.statics.getFilter = (data => data.booster);

// Get values for select menu
setSchema.statics.getSetList = async function(){
    const sets = await this.find({_id:{$ne:'_META'}}, 'name code block releaseDate', {sort:'-releaseDate'});
    return sets.map(s => s.toObject());
};


// Import booster pack data
setSchema.virtual('booster').set(function(v) {
    // Choose booster pack type
    let bType = 'default';

    if (!(bType in v)) {
        const bTypes = Object.keys(v);
        if (!bTypes.length) {
            console.error('Set.booster.setter: Missing data inside booster object.\n'+JSON.stringify(this));
            return;
        }

        bType = bTypes[0];
        console.log('Set.booster.setter: No default booster data found. Using: '+JSON.stringify(bTypes)+'[0]');
        this.boosterType = bType;
    }
    let boosterIn = v[bType];

    // Set fields
    if (boosterIn.boostersTotalWeight)
        this.boostersTotalWeight = boosterIn.boostersTotalWeight;
    
    this.sheets = []
    for (const sheet in boosterIn.sheets) {
        boosterIn.sheets[sheet].name = sheet;
        this.sheets.push(boosterIn.sheets[sheet]);
    }

    this.boosters = []
    boosterIn.boosters.forEach( layout =>
        this.boosters.push(layout)
    );

});

sheetSchema.path('cards').set(function(v) {
    return objToArray(v,'card','weight');
});

layoutSchema.path('contents').set(function(v) {
    return objToArray(v,'sheetName','count');
});

const setFix = (_,obj) => { obj.code = obj._id; delete obj._id; return obj; };
setSchema.set('toObject', {versionKey: false, useProjection: true, transform: setFix});

const Set = model('Set', setSchema);
module.exports = Set;