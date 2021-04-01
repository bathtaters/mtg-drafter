const Draft = require('../models/Draft');
const { random, sessionId } = require('../utils/basic');
const updateDb = require('./updateDb');
const mon = require('../config/db');

//updateDb(1, 1, 1, 0);

async function tester() {
    await Draft.deleteMany({});
    console.log('sessions database cleared.');

    // Session settings
    const settings = {
        names: ['Matt','Taylor','Nick','Gonti'],
        packs: ['SOI','KHM','A25','WAR'],
        sizes: [[2,3],[1,1],[8,3],[2,1],[1,3]]
    }

    // Construct
    let testDrafts = [], packIndex = 0;
    await Promise.all(settings.sizes.map( async size => {
        let nextPacks = [];
        for (const o = packIndex; packIndex < o + size[1]; packIndex++) {
            nextPacks.push(settings.packs[packIndex % settings.packs.length]);
        }
        const nextDraft = await Draft.newDraft({
            playerCount: size[0],
            packLayout: nextPacks
        });
        nextDraft.findPlayer(nextDraft.hostId).connected = false;
        for (let i=0; i < nextDraft.players.length && i < settings.names.length; i++) {
            nextDraft.players[i].name = settings.names[i];
        }
        await nextDraft.save()
        testDrafts.push(nextDraft);
    }));
    testDrafts.forEach(draft =>
        console.log(' > URL['+draft.players.length+'x'+draft.packs.length+
        ']: http://localhost:3000/draft/'+draft.sessionId)
    );
    

    //console.log('-----TEST-----\nhostId: '+session.hostId+', sessionId: '+session._id);
    //logSession(session);
    // let players = [session.findPlayer(session.hostId)]
    // for (let i=0; i<1; i++) players.push( await session.addPlayer() );
    // players[0].name = 'a host';
    // players[1].name = 'newGuy';
    // //players[3].name = 'tester';
    // console.log('Added new players');
    // logAllPlayers(session);
    
    
    // console.log('\nStartDraft: ' + await session.startDraft());
    // logAll(session);
    
    // let randCard = random.elem(players[1].currentPack);
    // console.log('\n'+players[1].name+' picks card: '+randCard._id);
    // await players[1].pickCard(randCard._id);
    // logAll(session);

    // console.log('\n'+players[1].name+' moves that card to his sideboard');
    // await players[1].swapBoard(randCard._id);
    // logAll(session);

    // console.log('\n'+players[3].name+' moves that card back to main');
    // await players[3].swapBoard(randCard._id);
    // logAll(session);

    // console.log('\n'+players[3].name+' moves that card back to side');
    // await players[3].swapBoard(randCard._id);
    // logAll(session);

    // console.log('\n'+players[3].name+' moves that card back to main again');
    // await players[3].swapBoard(randCard._id);
    // logAll(session);

    

    // TEST PASSING PACKS
    // console.log('\nSTART AUTO DRAFT\n');
    // for (let i=0; i<15*3; i++) {
    //     for (const p of players) {
    //         //if(p === players[3]) continue; // skip player
    //         if (p.packsHeld) randCard = await p.pickCard(random.elem(p.currentPack)._id);
    //         else randCard = 'Skipped due to no packs';
    //         if ([0,14].includes((i+1) % 15)) {
    //             console.log('\nNextPack['+i+'] ('+p.name+'): ' + randCard);
    //             logAll(session);
    //         }
    //     }
    // }
    // for (let i=0; i<3; i++) {
    //     if (players[3].packsHeld)
    //         randCard = await players[3].pickCard(random.elem(players[3].currentPack)._id);
    //     else randCard = 'Skipped due to no packs';
    //     console.log('\nNextPack['+i+'] ('+players[3].name+'): ' + randCard);
    //     logAll(session);
    // }

    //await session.save();
    console.log('saved');
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
