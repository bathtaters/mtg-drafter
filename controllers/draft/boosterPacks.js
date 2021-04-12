// Setup for a booster draft
const Set = require("../../models/Set");
const { swapArr } = require("../shared/basicUtils");
const { getWeightedRandom, balanceColors } = require("./shared");
const { boosterSortOrder } = require("../../config/definitions");
const { shuffle } = require("../shared/random");



// Order array using boosterSortOrder (in defintions)
function sortSheets(layout) {
    const end = boosterSortOrder.length;
    for (let i = 0, toIndex = layout.length; i < end; i++) {
        
        const fromIndex = layout.findIndex(elem => elem.sheetName == boosterSortOrder[i]);
        if (fromIndex < 0) continue;

        swapArr(fromIndex, --toIndex, layout);
    }
    return layout;
}

// Make a booster pack
async function getBoosterPack(setData) {
    
    // Select a booster pack layout to use
    const layout = ((setData.boosters.length == 1) ?
        setData.boosters[0] :
        getWeightedRandom(setData.boosters, setData.boostersTotalWeight))
        .contents;
    
    // Pre-sort the cards in the pack
    const sheets = sortSheets(layout);
    
    // TO help update definitions.boosterSortOrder
    console.log('Sheet names: '+JSON.stringify(sheets.map(entry => entry.sheetName)));
    
    let pack = [];
    for (const sheet of sheets) {
        // Fetch sheet
        const sheetData = setData.sheets.find(data => data.name == sheet.sheetName);
        if (!sheetData) {
            console.error(sheet.sheetName+' sheet not found in set '+setData.code);
            continue;
        }

        // Amount of cards to add from this sheet
        const sheetCount = sheet.count;
        if (sheetCount < 1)
            console.error('Invalid card count: ' + JSON.stringify(sheet), setData.code);

        // Pick random cards (loop ensures they are unique)
        let nextCard, newCards = [];
        for (let i=0; i < sheetCount; i++) {
            do {
                nextCard = getWeightedRandom(sheetData.cards, sheetData.totalWeight).card;
            } while (newCards.includes(nextCard));
            newCards.push(nextCard);
        }
        
        // Color-balancing algo, if sheet needs to be balanced
        if (sheetData.balanceColors) {
            await balanceColors(newCards, sheetData.cards);
            shuffle(newCards); /// shuffle to mixup colors
        }

        // Add foil status to cards
        const isFoil = sheetData.foil;
        newCards = newCards.map( uid => ({uuid: uid, foil: isFoil, picked: false}) );

        pack = pack.concat(newCards);
    }
    //console.log('PACK:\n'+pack.map(JSON.stringify).join('\n'));
    return pack;
}

// Main function
async function generateBoosterPacks(packSets, packsPerRound) {

    let packArray = [], roundPacks;
    for (const setCode of packSets) {
        
        const setData = await Set.findById(setCode);

        if (!('boostersTotalWeight' in setData)) {
            console.error('No booster data for '+setCode+'. Try updating database.');
            continue;
        }

        roundPacks = [];
        for (let i = 0; i < packsPerRound; i++) {
            const nextPack = await getBoosterPack(setData);
            roundPacks.push(nextPack);
        }
        packArray.push(roundPacks);
    }
    //console.log('packs '+JSON.stringify(packArray));
    return packArray;
}

module.exports = generateBoosterPacks
