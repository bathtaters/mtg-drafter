// Setup for a cube draft
const random = require('../shared/random');

function nextCubePack(cubePool, packSize) {
    let pack = [];
    for ( let poolLen = cubePool.length; pack.length < packSize; poolLen-- ) {

        const cardIndex = random.int(poolLen);
        pack.push({uuid: cubePool[cardIndex]});
        cubePool.splice(cardIndex, 1);

        if (poolLen == 0) {
            console.error("Cube ran out of cards!");
            break;
        }
    }
    return pack;
}

function generateCubePacks(cubeList, packsPerRound, packCount, packSize) {
    let counter = 0;

    let cubePool = [...cubeList];

    // Check size
    if ( packSize * packCount * packsPerRound > cubePool.length ) {
        console.error("Cube is too small to fill packs: cube has " + 
        cubePool.length + " cards but needs " + (packSize * packCount * packsPerRound) + "cards." );
        return [];
    }

    // Shuffle
    random.shuffle(cubePool);

    // Make packs
    let packArray = [], roundPacks;
    for (let i = 0; i < packCount; i++) {
        roundPacks = [];
        for (let j = 0; j < packsPerRound; j++) {
            roundPacks.push( nextCubePack(cubePool,packSize) );
        }
        packArray.push(roundPacks);
    }

    return packArray;
}

module.exports = generateCubePacks;