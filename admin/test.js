const Draft = require('../models/Draft');
const { random, sessionId } = require('../utils/basic');
const updateDb = require('./updateDb');
const mon = require('../config/db');
const fileOps = require('./fileOps');

//updateDb(1, 1, 1, 0);

async function tester() {
    await Draft.deleteMany({});
    console.log('sessions database cleared.');

    // Session settings
    const settings = {
        names: ['Matt','Taylor','Gonti','Nick'],
        packs: ['SOI','KHM','A25','WAR'],
        sizes: [[2,3],[1,1],[8,3],[2,1],[1,3],[2,3,15]] // [players,packs,packSize? (will use cube)]
    }

    // Construct Drafts
    let testDrafts = [], packIndex = 0;
    await Promise.all(settings.sizes.map( async size => {
        let draftSettings;
        // Cube Draft
        if (size.length == 3) {
            draftSettings = {playerCount: size[0], packCount: size[1], packSize: size[2]};
            draftSettings.cubeData = await fileOps.testCube;
        
        // Booster Draft
        } else {
            let nextPacks = [];
            for (const o = packIndex; packIndex < o + size[1]; packIndex++) {
                nextPacks.push(settings.packs[packIndex % settings.packs.length]);
            }
            draftSettings = { playerCount: size[0], packLayout: nextPacks };
        }

        const nextDraft = await Draft.newDraft(draftSettings);

        // Add players
        nextDraft.findPlayer(nextDraft.hostId).connected = false;
        for (let i=0; i < nextDraft.players.length && i < settings.names.length; i++) {
            nextDraft.players[i].name = settings.names[i];
        }
        await nextDraft.save()
        testDrafts.push(nextDraft);
    }));

    
    testDrafts.forEach(draft =>
        console.log(' > URL('+draft.name+'['+draft.players.length+
        ']): http://192.168.0.139:3000/draft/'+draft.sessionId)
    );
    console.log('Servers ready.');
}


tester();  






/*
    playerCount = number (default: 8)

    for Cube:
        packSize = number (default: 15)
        packCount = number (default: 3)
        cubeData = array of cards (default: [], len >= playerCount*packCount*packSize)
    else:
        packLayout = array of setCodes (default: [], len > 0)

*/
