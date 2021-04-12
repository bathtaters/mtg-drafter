// Setup a New Draft using a settings object
/*
settings object should be an object with:
    name = draftName
    playerCount = number (default: 8)
    Cube:
        packSize = number (default: 15)
        packCount = number (default: 3)
        cubeData = array of cards (default: [], len >= playerCount*packCount*packSize)
    Booster:
        packLayout = array of setCodes (default: [], len > 0)
*/
const boosterPacks = require('./boosterPacks');
const cubePacks = require('./cubePacks');


async function newDraft(settings) {
    let newDraft = { players: [] };

    if ('name' in settings) newDraft.name = settings.name;

    while (newDraft.players.length < settings.playerCount) {
        newDraft.players.push({});
    }
    if (newDraft.players.length == 0) {
        console.error('New session has no players!');
        return;
    }

    if ('cubeData' in settings) {
        newDraft.name = settings.name || 'Cube Draft';
        newDraft.packs = await cubePacks(
            settings.cubeData,
            newDraft.players.length,
            settings.packCount,
            settings.packSize
        );
    } else {
        newDraft.name = settings.name || settings.packLayout.join(',') + ' Draft';
        newDraft.packs = await boosterPacks(
            settings.packLayout,
            newDraft.players.length
        );
    }

    if (!newDraft.packs || !newDraft.packs.length) return;
    newDraft = new this(newDraft);

    newDraft.hostId = await newDraft.addPlayer().then(p => p._id);
    
    return newDraft.save();
}

module.exports = newDraft;