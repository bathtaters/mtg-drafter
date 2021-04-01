// Metadata headers from MtgJSON

const { model } = require('mongoose');
const mtgDb = require('../config/db');

const metaSchema = new mtgDb.Schema({
    _id: {type: String, default: '_META'},
    name: String,
    date: Date,
    version: String,
    url: String
}, {timestamps: true});

metaSchema.path('url').set(function(v) {
    this.name = v.substring(v.lastIndexOf('/')+1, v.lastIndexOf('.'));
    return v;
})

const Sets = model('Meta', metaSchema, 'sets');
const Cards = model('Meta', metaSchema, 'cards');
module.exports = {
    Sets: Sets,
    Cards: Cards
};