const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Card = require('../models/card');

const testFile = path.join(__dirname,'cube01.txt');
const testDeck = path.join(__dirname,'deck01.txt');

async function importCube(filepath) {

    return new Promise( (resolve, reject) => {
        const reader = readline.createInterface({
            input: fs.createReadStream(filepath),
            output: process.stdout,
            terminal: false
        });
        
        let result = [];
        reader.on('line', async line => {
            trimmed = line.trim();
            //console.log('    looking up: '+JSON.stringify(line));
            result.push(
                Card.findOne({ $or: [
                    { 'name': trimmed },
                    { 'faceName': trimmed }
                ] },'_id').then( card => card ? card._id : console.error(trimmed+' not found!'))
            );
        });

        reader.on('close', () => resolve(Promise.all(result)));
        reader.on('error', () => reject);
    });
}

// cards == [uuids]
const addCard = (uuid, writer) => Card.findById(uuid, '_id name faceName').then( card =>
    card ? writer.write('1 '+card.printedName+'\n') : console.error(uuid+' not found!')
);
async function exportDeck(cards, filepath) {
    const writer = fs.createWriteStream(filepath);

    for (const card of cards.main) { await addCard(card.uuid, writer) };
    writer.write('\nSideboard\n');
    for (const card of cards.side) { await addCard(card.uuid, writer) };

    writer.end();
}

module.exports = {
    import: importCube,
    export: exportDeck
}

console.log('importing test cube'); console.time('imported cube');
module.exports.testCube = importCube(testFile)
    .then( result => result.filter( card => card ))
    .then( cube => {
        console.timeEnd('imported cube');
        console.log('imported '+cube.length+' cards. like: '+cube[0]);
        return cube;
    })
    .catch( err => console.error(err));
