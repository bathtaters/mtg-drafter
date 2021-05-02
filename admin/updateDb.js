// Updates mtgJSON data from website (Takes ~ 1 hr)
//   Usage: updateDb(updateSet?,updateCards?,forceUpdate?) => Promise
// NOT WORKING ON SERVER (Uses too much memory)

const https = require('https');
const JSONStream = require('JSONStream');
const Set = require('../models/Set');
const Meta = require('../models/Meta');
const Card = require('../models/Card');
const { basicLands } = require('../config/definitions');
const Settings = require('../models/Settings');

// Stored URLs
const setKey = 'dbSetUrl';
const cardKey = 'dbCardUrl';

// Generic JSON Parser - filter/saver works like array.filter()/array.forEach() (saver must return Promise)
const maxAsyncThreads = 250;
function downloadJSON(url, parsePath, filter=undefined, saver=undefined, limit=0) {
    
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
            const jsonPipe = res.pipe(JSONStream.parse(parsePath));
            
            let result = [], filtered = [], count = 0, threads = 0;
            jsonPipe.on('data', data => {
                // jsonPipe.pause(); // force to run sync
                //const printable = typeof data == 'object' ? data.name : data
                //console.log('new data: '+printable);
                
                if (!filter || filter(data)) {

                    if (saver) {
                        if (++threads === maxAsyncThreads) jsonPipe.pause();

                        saver(data).then(() => {
                            if (threads-- === maxAsyncThreads) jsonPipe.resume();
                        });
                    }
                    else result.push(data);

                    if (++count === limit && limit) return jsonPipe.destroy();
                }
            });
            jsonPipe.on('error', reject);
            jsonPipe.on('close', () => resolve(saver ? count : result) );
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
        downloadJSON(url, ['meta'], 0, 0, 1).then(data => data[0])
    ]);

    let willUpdate = true;
    if (oldMeta && oldMeta.version == newMeta.version) {
        console.log(`${Model.modelName} is already up to date`);
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
    );
    
    console.timeEnd('Updated '+Model.modelName)
    console.log(new Date().toISOString(), 'Retrieved '+count+' entries');
    return count;
}


// Retrieve Alt card IDs (Must be done after all documents are saved)
async function getCardAlts(doc, model) {
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
    // const model = doc.model(doc.constructor.modelName, doc.schema);
    const matches = await model.find(query, '_id')
    
    // Push matches & save
    doc.printings = matches.map( match => match._id );
    await doc.save()
    // console.log(doc.name,'added',matches.length,'alts.')
    return matches.length;
}


// Get all card alt-IDs
async function getAllCardAlts(CardModel, showProgress=false) {
    // Generate list of cards with printings.len > 0
    console.log(new Date().toISOString(),'Retrieving records to scan for alts')
    const cards = await CardModel.find({ 'printings.0': { $exists: true } });

    // Call setAlts on each card from above
    console.log(new Date().toISOString(), cards.length+' cards to scan for alts');
    let c = 0;
    for (const card of cards) {
        const n = await getCardAlts(card, CardModel);
        
        // Show incremental progress
        if (n) ++c;
        if (showProgress && c % 2500 == 0)
            console.log(new Date().toISOString(), c+'/'+cards.length+' cards updated');
    }

    console.log(new Date().toISOString(), c+'/'+cards.length+' cards updated');
    return c;
};




// Main function
async function updateBoth(
    updateSets=true, updateCards=true,
    skipCurrent=true, 
    fixCardAlts=true, limit=0
) {
    // console.log(' >>>>> UPDATE DB: sets:'+updateSets+',cards:'+updateCards+',outdate:'+skipCurrent+',altfix:'+fixCardAlts);
    // return (skipCurrent ? '' : 'Force-') + 'Updated database: '+updateSets+' sets + '+updateCards+' cards (w/ '+fixCardAlts+' alt IDs)';

    let msg = (skipCurrent ? '' : 'Force-') + 'Updated database:';
    let cardCount;
    if (updateSets) {
        const setDatabase = await Settings.get(setKey);
        const setCount = await updateDatabase(setDatabase, Set, Meta.Sets, !skipCurrent, limit);
        msg += ' '+(setCount||'no new')+' sets +';
    }
    if (updateCards) {
        const cardDatabase = await Settings.get(cardKey);
        cardCount = await updateDatabase(cardDatabase, Card, Meta.Cards, !skipCurrent, limit);
        msg += ' '+(cardCount||'no new')+' cards';

        console.time('Updated Card indexes');
        await Card.ensureIndexes();
        console.timeEnd('Updated Card indexes');
    } else if (fixCardAlts) { msg += ' cards not updated'; }

    if (fixCardAlts && (cardCount || !updateCards)) {
        console.time('Updated CardAlts');
        const altCount = await getAllCardAlts(Card).then(c => console.timeEnd('Updated CardAlts') || c);
        msg += ' ('+(altCount||'no')+' new alt IDs stored)';
    } else if (fixCardAlts) {
        console.log('No new cards to search for alts');
    }
    
    if(updateSets || updateCards)
        console.log(new Date().toISOString(), 'Database(s) update has finished');
    else
        console.log(new Date().toISOString().toLocaleString(), 'No databases chosen');
    
    return (msg.endsWith(':') || msg.endsWith('+')) ? msg.slice(0,-1) : msg;
}

async function getCounts() {
    // Count total records ( -1 for metadata )
    const set = await Set.countDocuments().then(c=>c-1);
    const card = await Card.countDocuments().then(c=>c-1);
    return { set, card };
}


module.exports = {
    update: updateBoth, 
    storeCardAlts: () => getAllCardAlts(Card),
    getCounts: getCounts,
    url: {
        set: () => Settings.get(setKey),
        card: () => Settings.get(cardKey),
        updateSet: v => Settings.set(setKey,v),
        updateCard: v => Settings.set(cardKey,v),
    }
};