// Updates mtgJSON data from website (Takes ~ 1 hr)
//   Usage: updateDb(updateSet?,updateCards?,forceUpdate?) => Promise

const https = require('https');
const JSONStream = require('JSONStream');
const Set = require('../models/Set');
const Meta = require('../models/Meta');
const Card = require('../models/Card');
const { basicLands } = require('../config/definitions');

// Download links
const setDatabase = 'https://mtgjson.com/api/v5/AllPrintings.json';
const cardDatabase = 'https://mtgjson.com/api/v5/AllIdentifiers.json';


// Generic JSON Parser - filter/map works like array.filter()/array.map()
function downloadJSON(url, parsePath, filter=undefined, map=undefined, limit=0) {
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            // Any 2xx status code signals a successful response but
            // here we're only checking for 200.
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // Consume response data to free up memory
                res.resume();
                reject();
            }

            res.setEncoding('utf8');
            const pipline = res.pipe(JSONStream.parse(parsePath));

            
                let result = [], filtered = [], count = 0;
                pipline.on('data', data => {
                    //const printable = typeof data == 'object' ? data.name : data
                    //console.log('new data: '+printable);
                    
                    if (!filter || filter(data)) {
                        //if (filter) console.log('filter: true');
                        //if (map) console.log('mapped to: '+map(data));
                        
                        result.push(map ? map(data) : data);
                        if (limit && limit == ++count) return pipline.destroy();
                    }
                });
                pipline.on('error', reject);
                pipline.on('close', () => resolve(result) );
        }).on('error', (e) => {
            console.error(`Error downloading data: ${e.message}`);
            reject();
        });
    });
}



// Push JSON-Parsed data into database
async function updateDatabase(url, Model, MetaModel, force=false, limit=0) {
    // Check if metadata is up to date
    const [oldMeta, newMeta] = await Promise.all([
        MetaModel.findById('_META'),
        downloadJSON(setDatabase, ['meta'], 0, 0, 1).then(data => data[0])
    ]);

    let willUpdate = true;
    if (oldMeta && oldMeta.version == newMeta.version) {
        console.log(`${Model.modelName} is already up to date`)
        willUpdate = false;
    } else if (oldMeta && oldMeta.date >= new Date(newMeta.date)) {
        console.log(`${Model.modelName} version is newer than available version (Existing:${oldMeta.version}, Available:${newMeta.version})`);
        willUpdate = false;
    }
    if (!willUpdate && !force)
        return console.log(new Date().toISOString(), 'Aborting update');
    if (force) console.log(new Date().toISOString(), 'Updating anyway (Force enabled)')

    // Erase old records
    await Model.collection.deleteMany({}).then(data =>
        console.log(new Date().toISOString(), 'Cleared '+Model.modelName+' data')
    );

    // Set Meta fields
    newMeta.url = url;
    await MetaModel.create(newMeta).then(data =>
        console.log(new Date().toISOString(), 'Updated '+Model.modelName+' metadata')
    );
    
    // Download payload to database
    console.time('Updated '+Model.modelName);
    const count = await downloadJSON(
            url, ['data',true],
            Model.getFilter,
            data => Model.create(data),
            limit // only gets 1st n entries (FOR TESTING)
    ).then( data => data.length );
    
    console.timeEnd('Updated '+Model.modelName)
    console.log(new Date().toISOString(), 'Retrieved '+count+' entries');
    return count;
}


// Retrieve Alt card IDs (Must be done after all documents are saved)
async function getCardAlts(doc) {
    //console.log('Getting alts for '+doc.name);
    if (basicLands.includes(doc.name)) {
        doc.printings = []; return doc.save();
    }
    
    // Remove card's own set from search
    const thisSetIndex = doc.printings.indexOf(doc.setCode);
    if (thisSetIndex != -1) doc.printings.splice(thisSetIndex, 1);
    if (!doc.printings.length) { doc.printings = []; return doc.save(); }

    // Find matching card ids by name
    let query = { setCode: { $in: doc.printings } };
    if (doc.faceName) query.faceName = doc.faceName;
    else query.name = doc.name;
    const model = doc.model(doc.constructor.modelName, doc.schema);
    const matches = await model.find(query, '_id')
    
    // Push matches & save
    doc.printings = matches.map( match => match._id );
    return doc.save();
        //.then( _ => console.log(doc.name,'added',matches.length,'alts.') );
}


// Get all card alt-IDs
async function getAllCardAlts(CardModel) {
    // Generate list of cards with printings.len > 0
    console.log(new Date().toISOString(),'Retrieving records to scan for alts')
    const cards = await CardModel.find({ 'printings.0': { $exists: true } });

    // Call setAlts on each card from above
    console.log(new Date().toISOString(), cards.length+' cards to scan for alts');
    let c = 0;
    for (const card of cards) {
        await getCardAlts(card);
        
        // Show incremental progress
        c++; if (c % 2500 == 0)
            console.log(new Date().toISOString(), c+'/'+cards.length+' cards updated');
    }

    console.log(new Date().toISOString(), c+'/'+cards.length+' cards updated');
    return c;
};




// Main function (Later make 'updateSets' = setDatabase)
async function updateBoth(
    updateSets=true, updateCards=true, forceUpdates=false, 
    fixCardAlts=true, limit=0
) {
    if (updateSets) {
        await updateDatabase(setDatabase, Set, Meta.Sets, forceUpdates, limit);
    }
    if (updateCards) {
        const c = await updateDatabase(cardDatabase, Card, Meta.Cards, forceUpdates, limit);

        if (fixCardAlts && c) {
            console.time('Updated CardAlts');
            await getAllCardAlts(Card).then(_ => console.timeEnd('Updated CardAlts'));
        }
    }
    
    if(updateSets || updateCards)
        console.log(new Date().toISOString(), 'Database(s) update has finished');
    else
        console.log(new Date().toISOString().toLocaleString(), 'No databases chosen');
}



module.exports = updateBoth;