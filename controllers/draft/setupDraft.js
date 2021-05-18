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
const { getURLCode } = require('./sessionURL');

async function newDraft(settings) {
    // Setup player slots
    let newDraft = { players: [] };

    if ('name' in settings) newDraft.name = settings.name;

    while (newDraft.players.length < settings.playerCount) {
        newDraft.players.push({});
    }
    if (newDraft.players.length == 0) {
        console.error('New session has no players!');
        return;
    }

    // Setup Cube draft
    if ('cubeData' in settings) {
        newDraft.name = settings.name || 'Cube Draft';
        newDraft.packs = await cubePacks(
            settings.cubeData,
            newDraft.players.length,
            settings.packCount,
            settings.packSize
        );
    
    // Setup Booster draft
    } else {
        newDraft.name = settings.name || settings.packLayout.join(',') + ' Draft';
        newDraft.packs = await boosterPacks(
            settings.packLayout,
            newDraft.players.length
        );
    }

    // Instantiate session
    if (!newDraft.packs || !newDraft.packs.length) return;
    newDraft._id = getURLCode(newDraft.createdAt);
    newDraft = new this(newDraft);

    // Add host to first slot
    newDraft.hostId = await newDraft.addPlayer().then(p => p._id);
    return newDraft.save();
}

module.exports = newDraft;