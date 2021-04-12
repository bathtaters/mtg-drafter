// Automatically set land count

const { cardColors } = require("../../config/definitions");
const Card = require("../../models/Card");

const defaultDeckSize = 40;
const sideboardLands = 5; // per color



// Count up color pips (& count lands as 'other')
const pipRegEx = /{([^}]+)}/g; 
const blankCounter = cardColors.reduce((acc,c) => {acc[c] = 0; return acc;}, {});

function totalPips(cardData) {
    let count = { ...blankCounter };
    cardData.forEach( card => {
        if (card.types.includes('Land')) { count.other++; } // Count lands
        if (!card.manaCost) return;

        // Count each pip on card
        for (const match of card.manaCost.matchAll(pipRegEx)) {
            let i = match[1].length;
            while (i--) {
                if(match[1][i] in count) count[match[1][i]]++;
            }
        }
    });
    
    // Include sum of pips
    count.sum = Object.keys(count).reduce( (sum,c) => {
        if (c.length == 1) sum += count[c]; return sum;
    }, 0);

    return count;
}

// Get card data and pass to totalPips()
const deckProjections = { _id: 0, manaCost: 1, types: 1 };
async function getMainDeckCost(deck) {   
    let costs = []
    // DOESN'T GET DFC
    for (const card of deck) {
        const newCard = await Card.findById(card.uuid, deckProjections);
        if (newCard) costs.push(newCard);
        else console.log('Unable to find card: '+card.uuid);
    }
    return totalPips(costs);
}

// Main function
async function getAutoLands(deckSize = 0) {
    if (deckSize < 1) deckSize = defaultDeckSize;

    // Get total number of lands needed to add
    const landCount = deckSize - this.cards.main.length;
    if (landCount < 1) {
        console.log('Auto Lands: mainboard is larger than '+deckSize);
        return;
    }

    // Build new land object to overwrite
    let newLands = {};
    const costs = await getMainDeckCost(this.cards.main);
    Object.keys(costs).forEach( c => {

        if (c.length != 1) return; // Skip 'other'
        
        // Mainboard land algorithm
        newLands['main-'+c.toLowerCase()] = Math.round(landCount * costs[c] / costs.sum);

        // Sideboard fixed amount
        newLands['side-'+c.toLowerCase()] = sideboardLands;
    });

    return this.setLandData(newLands);
}


module.exports = getAutoLands;