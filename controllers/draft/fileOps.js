const Card = require('../../models/Card');
const { basicLands, cardColors } = require('../../config/definitions');
const { splitLines } = require('../shared/basicUtils');
const asyncPool = require('tiny-async-pool');

// Pre-compiled RegExs
const qtyRegEx = new RegExp(/^\s*(\d)+\s+(.*)\s*$/)



// Input line to Card obj
const lineToCards = async (line, missing) => {
    let found = [];
    // Determine format
    let trimmed, qty = 1;
    const capture = line.match(qtyRegEx);
    if (capture) [qty, trimmed] = [+capture[1], capture[2]];
    else trimmed = line.trim();
    if (!trimmed) return found;

    // Lookup card
    const regexName = new RegExp('^'+trimmed+'$', 'i');
    const cardId = await Card.findOne({
        $or: [
            { 'name': { $regex: regexName } },
            { 'faceName': { $regex: regexName } }
        ],
        'side': { $in: [null, 'a'] },
        'multiverseId': { $exists: true } // ONLY FINDS IMAGES ON GATHERER
    },'_id').then( card => card ? card._id : 0)
    
    if (cardId) {
        for (let i=0; i < qty; i++) { found.push(cardId) }
    }
    else if (missing) missing.push(trimmed); // If missing exists, append to it
    return found;
};


// Input UUID to plain-text line
const basicTextLine = uuid => Card.findById(uuid, '_id name faceName').then( card =>
    card ? '1 '+card.printedName+'\n' : console.error(uuid+' not found!'));
const basicLandText = (array, board, i) => {
    const id = board+'-'+cardColors[i].toLowerCase();
    const land = array.find( elem => elem._id == id);
    return land && 'count' in land && land.count > 0 ? land.count+' '+basicLands[i]+'\n' : ''
}





// Import text blob from user
async function importText(file) {
    let missing = [];
    const cards = await asyncPool(
        500, splitLines(file.data),
        line => lineToCards(line, missing)
    );
    return {cards: cards.flat(), missing: missing};
}

// Export text file to user
async function exportText(cards) {
    // Main board
    let deckText = '';
    for (const card of cards.main) { deckText += await basicTextLine(card.uuid); }
    for (let i=0; i < 5; i++) { deckText += basicLandText(cards.basicLands, 'main', i); }

    // Sideboard Lands
    let sideLands = '';
    for (let i=0; i < 5; i++) { sideLands += basicLandText(cards.basicLands, 'side', i); }

    // Sideboard
    if (cards.side.length || sideLands) {
        deckText += '\nSideboard\n';
        for (const card of cards.side) { deckText += await basicTextLine(card.uuid); }
        deckText += sideLands
    }
    
    return deckText;
}





module.exports = {
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


// const fs = require('fs');
// const path = require('path');
// const readline = require('readline');

// FILE OPS (NOT DEBUGGED)
// async function importCube(filepath, missing=0) {
//     async function readCubeFile(filepath, missing=0) {
//         return new Promise( (resolve, reject) => {
//             const reader = readline.createInterface({
//                 input: fs.createReadStream(filepath),
//                 output: process.stdout,
//                 terminal: false
//             });
            
//             let result = [];
//             reader.on('line', async line => {
//                 result.push( await lineToCards(line, missing) );
//             });
    
//             reader.on('close', () => resolve(Promise.all(result).then(data => data.flat())));
//             reader.on('error', () => reject);
//         });
//     }
//     return readCubeFile(filepath, missing);
// }

// async function exportDeck(cards, filepath) {
//     const addCard = (uuid, writer) => basicTextLine(uuid).then(line => line && writer.write(line));
//     const addLand = (array, i, writer) => {
//         const line = basicLandText(array,i); line && writer.write(line); // THIS CHANGED!!!
//     }
//     const writer = fs.createWriteStream(filepath);

//     for (const card of cards.main) { await addCard(card.uuid, writer); }
//     for (let i=0; i < 5; i++) { deckText += addLand(cards.basicLands.main, i, writer); }
//     writer.write('\nSideboard\n');
//     for (const card of cards.side) { await addCard(card.uuid, writer); }

//     writer.end();
// }

