const basic = require('./basic');


function generateCubePacks(cubeList, packsPerRound, packCount, packSize) {
    let counter = 0;

    function nextCubePack(cubePool, packSize) {
        let pack = [];
        for ( let poolLen = cubePool.length; pack.length < packSize; poolLen-- ) {

            const cardIndex = basic.random.int(poolLen);
            pack.push({uuid: cubePool[cardIndex]});
            cubePool.splice(cardIndex, 1);

            if (poolLen == 0) {
                console.error("Cube ran out of cards!");
                break;
            }
        }
        return pack;
    }

    let cubePool = [...cubeList];

    // Check size
    if ( packSize * packCount * packsPerRound > cubePool.length ) {
        console.error("Cube is too small to fill packs: cube has " + 
        cubePool.length + " cards but needs " + (packSize * packCount * packsPerRound) + "cards." );
        return [];
    }

    // Shuffle
    basic.random.shuffle(cubePool);

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