// MtG Specific utilities
const { maxIndex } = require('../shared/basicUtils');
const { cardColors } = require('../../config/definitions');
const Card = require('../../models/Card');
const random = require('../shared/random');

// RNG w/ weights
const weightKey = 'weight' // key to use, must be in all objects in array
function getWeightedRandom(array, totalWeight=0) {
    
    // Calculate weight if total not given
    if (totalWeight < 1) {
        totalWeight = array.reduce( (acc,elem) => {
            if (weightKey in elem && typeof elem[weightKey] === 'number') acc += elem[weightKey];
            return acc;
        }, 0);
        if (totalWeight < 1) { 
            console.error('Error finding weights for random choice, using equal weights.'); 
            return random.elem(array);
        }
    }
    
    // Get random number (Between 1 - totalWeight (inclusive))
    const rand = random.int(totalWeight) + 1;
    
    // Count up to random number using weights
    let elem, sum = 0;
    for (elem of array) {
        if (!(weightKey in elem)) continue;
        
        sum += elem[weightKey];
        if (sum > rand) break;
    }

    // Check for anything fishy, then return the selected element
    if (sum < 1 || sum > totalWeight) 
        console.error(`Error w/ weighted-RNG (sum:${sum},total:${totalWeight}):\n${JSON.stringify(array)}`);
    return elem;
}




// Return mono-colored cards of a specific color from a uuid array
const findByColor = (cards,color) => Card.find({_id:{$in:cards}, colors:[color]},'colors');
const findNonMono = (cards) => Card.find({_id:{$in:cards}, monoColor:0},'colors');

// Count each color of mono-colored cards (+ colorless/multicolored)
async function countMonoColors(cards) {
    const cardData = await Card.find({ _id: { $in: cards } }, 'colors monoColor');
    return cardData.reduce((acc, card) => {
        if (card.monoColor)
            acc[cardColors.indexOf(card.colors[0])] += 1;
        else
            acc[5] += 1;
        return acc
    }, [0, 0, 0, 0, 0, 0]);
}



// Color balance pack (Drawing from pool if needed, setCode is a hint for card lookup)
async function balanceColors(pack, pool, totalWeight=0) {

    // Normalize input (Accepts [ uids ] or [ {card:uid, weight:int} ])
    let cardIds = pool, isWeighted = false;
    if (typeof cardIds[0] != 'string' && 'card' in cardIds[0]) {
        cardIds = cardIds.map( elem => elem.card );
        isWeighted = true;
    }
    if (!Array.isArray(cardIds) || typeof cardIds[0] != 'string') {
        console.error('balanceColors: Improperly formated card list, cancelling balance.');
        return pack
    }

    // Get color levels
    const colorCount = await countMonoColors(pack);
    //console.log('colors: '+cardColors+'\ncounts: '+colorCount);    
    
    for (let i = 0; i < 5; i++) {
        if (colorCount[i]) continue;
        
        // Create a pool of ONLY the missing color
        const missingPool = await findByColor(cardIds, cardColors[i]);
        if (!missingPool || !missingPool.length) continue; // No cards of this color exist
        
        // Pick a random card to replace (From the most prominent color/non-color)
        const replColorI = maxIndex(colorCount);
        let replacements = await (
            cardColors[replColorI] == 'other' ?
            findNonMono(pack) : findByColor(pack, cardColors[replColorI])
        );
        const replIndex = pack.indexOf(random.elem(replacements));

        // Pick a random card to swap with replacement card
        let newCard;
        if (isWeighted) {
            // Join weights to pool
            missingPool.forEach(
                card => card.weight = pool.find(entry => entry.card == card._id).weight
            );
            if (!missingPool.length)
                console.error('WeightedPool empty for '+cardColors[i]+'? '+JSON.stringify(missingPool))
            newCard = getWeightedRandom(missingPool,totalWeight).card
        } else {
            newCard = random.elem(missingPool);
        }

        // Perform the swap
        pack[replIndex] = newCard;
        colorCount[i]++; colorCount[replColorI]--;

        // console.log('ColorBalance: '+cardColors[i]+' card swapped with '+cardColors[replColorI]+' card.');
    }

    //console.log('colors: '+cardColors+'\ncounts: '+colorCount);
    return pack;

}


module.exports = {
    getWeightedRandom: getWeightedRandom,
    balanceColors: balanceColors
};
