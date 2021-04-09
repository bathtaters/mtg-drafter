const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Card = require('../models/Card');
const { basicLands } = require('../config/definitions');
const basic = require('../utils/basic');

// Reading/Writing UUID shared functions
const qtyRegEx = new RegExp(/^\s*(\d)+\s+(.*)\s*$/)
const lineToCards = async (line, missing) => {
    let found = [];
    // Determine format
    let trimmed, qty = 1;
    const capture = line.match(qtyRegEx);
    if (capture) [qty, trimmed] = [+capture[1], capture[2]];
    else trimmed = line.trim();
    if (!trimmed) return found;
    //console.log('    looking up: '+JSON.stringify(line));

    // Lookup card
    const cardId = await Card.findOne({ $or: [
        { 'name': trimmed },
        { 'faceName': trimmed }
    ] },'_id').then( card => card ? card._id : 0)
    if (cardId) {
        for (let i=0; i < qty; i++) { found.push(cardId) }
    }
    else if (missing) missing.push(trimmed); // If missing exists, append to it
    return found;
};
const basicTextLine = uuid => Card.findById(uuid, '_id name faceName').then( card =>
    card ? '1 '+card.printedName+'\n' : console.error(uuid+' not found!'));
const basicLandText = (array, i) => 
    array[i] && array[i] != '0' ? array[i]+' '+basicLands[i]+'\n' : '';





// TEXT BLOB OPS
async function importText(file) {
    let missing = [];
    const cards = await Promise.all(basic.splitLines(file.data).map( line =>
        lineToCards(line, missing)
    ));
    return {cards: cards.flat(), missing: missing};
}

async function exportText(cards) {
    let deckText = '';
    for (const card of cards.main) { deckText += await basicTextLine(card.uuid); }
    for (let i=0; i < 5; i++) { deckText += basicLandText(cards.basicLands.main, i); }

    deckText += '\nSideboard\n';
    for (const card of cards.side) { deckText += await basicTextLine(card.uuid); }
    for (let i=0; i < 5; i++) { deckText += basicLandText(cards.basicLands.side, i); }
    return deckText;
}




// FILE OPS (NOT DEBUGGED)
async function importCube(filepath, missing=0) {
    async function readCubeFile(filepath, missing=0) {
        return new Promise( (resolve, reject) => {
            const reader = readline.createInterface({
                input: fs.createReadStream(filepath),
                output: process.stdout,
                terminal: false
            });
            
            let result = [];
            reader.on('line', async line => {
                result.push( await lineToCards(line, missing) );
            });
    
            reader.on('close', () => resolve(Promise.all(result).then(data => data.flat())));
            reader.on('error', () => reject);
        });
    }
    return readCubeFile(filepath, missing);
}

async function exportDeck(cards, filepath) {
    const addCard = (uuid, writer) => basicTextLine(uuid).then(line => line && writer.write(line));
    const addLand = (array, i, writer) => {
        const line = basicLandText(array,i); line && writer.write(line);
    }
    const writer = fs.createWriteStream(filepath);

    for (const card of cards.main) { await addCard(card.uuid, writer); }
    for (let i=0; i < 5; i++) { deckText += addLand(cards.basicLands.main, i, writer); }
    writer.write('\nSideboard\n');
    for (const card of cards.side) { await addCard(card.uuid, writer); }

    writer.end();
}





module.exports = {
    importFile: importCube,
    exportFile: exportDeck,
    import: importText,
    export: exportText
}


// Import test cube for debugging
// console.log('importing test cube'); console.time('imported cube');
// const testFile = path.join(__dirname,'cube01.txt');
// module.exports.testCube = importCube(testFile)
//     .then( result => result.filter( card => card ))
//     .then( cube => {
//         console.timeEnd('imported cube');
//         console.log('imported '+cube.length+' cards. like: '+cube[0]);
//         return cube;
//     })
//     .catch( err => console.error(err));
