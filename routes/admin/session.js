// ADMIN PANEL - SESSION DETAILS router

var express = require('express');
var router = express.Router();

const Draft = require('../../models/Draft');
const { sessionListData, playerData } = require('../../controllers/shared/populateSession');
const { addSlash } = require('../../controllers/shared/middleware');
const { reply, daysAgo } = require('../../controllers/shared/basicUtils');
const fileOps = require('../../controllers/draft/fileOps');

  
   

/* ----- GET Session Detail page. ----- */

// Get page
router.get('/:sessionId', addSlash, async function(req, res, next) {
    const session = await Draft.findBySessionId(req.params.sessionId);
    if (!session) return res.send('Session "'+req.params.sessionId+'" does not exist.');

    const players = await playerData(session);
    return res.render('session', {
        title: 'Admin - '+session.name,
        session: sessionListData(session),
        players: players
    });
});






/* ----- POST session changes. ----- */

// Remove based on sessionId
router.post('/:sessionId/Delete', async function(req, res, next) {
    const session = await Draft.findBySessionId(req.params.sessionId,'_id');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});
    await session.deleteOne();
    return reply(res, {sessionIds: session.sessionId, action: 'Delete'});
});

// Remove based on date
router.post('/:sessionId/Clear', async function(req, res, next) {
    const sessions = await Draft.find({updatedAt: {$lte: daysAgo(req.body.clearDays)}},'_id')
    const sessionIds = await Promise.all(sessions.map(async session => {
      await session.deleteOne(); return session.sessionId;
    }));
    
    
    return reply(res, {sessionIds, action: 'Clear'});
});

// Disconnect all players
router.post('/:sessionId/Disconnect', async function(req, res, next) {
    const session = await Draft.findBySessionId(req.params.sessionId,'players logEntries');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});

    await session.disconnectAll(req.auth.user);
    return reply(res, {sessionId: session.sessionId, disconnected: session.players.every(p => !p.connected)})
});
    
// Disconnect a single player
router.post('/:sessionId/PlayerDisconnect', async function(req, res, next) {
    const session = await Draft.findBySessionId(req.params.sessionId,'players logEntries');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});

    const player = await session.findPlayerByCookie(req.body.playerId, 'name connected');
    if (!player) return reply(res, {
      sessionId: req.params.sessionId,
      error:'Player "'+req.body.playerId+'" does not exist.'
    });

    await player.disconnect(req.auth.user);
    return reply(res, {sessionId: session.sessionId, playerId: player.cookieId, disconnected: !player.connected})
});

// Download player deck list
router.get('/:sessionId/player/:playerId/downloadDeck', async function(req, res, next) {
    const session = await Draft.findBySessionId(req.params.sessionId,'name players logEntries');
    if (!session) return res.send('Session "'+req.params.sessionId+'" does not exist.');
    const player = await session.findPlayerByCookie(req.params.playerId,'name cards');
    if (!player) return res.send('Player "'+req.params.playerId+'" does not exist.');

    const deckText = await fileOps.export(player.cards);
    const filename = player.name+' - '+session.name+' Deck.txt'
    res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition':'attachment; filename="'+filename+'"'
    });
    await session.log('Admin ('+req.auth.user+') downloaded deck list of '+player.identifier+'.');
    return res.send(deckText);
});


// Catch other actions
router.post('/:sessionId/:action', async function(req, res, next) {
    return reply(res, {sessionId: req.params.sessionId, action: req.params.action, error: 'Invalid action.'});
});
  



// Forward initial session POST to session/id GET
router.post('/', async function(req, res, next) {
    let sessionId = req.body.sessionId;
    if(!sessionId) return res.send('No sessionId posted.');
    if(Array.isArray(sessionId)) sessionId = sessionId[0];
    console.log('Redirecting to: '+sessionId);
    res.redirect(req.originalUrl + (req.originalUrl.endsWith('/') ? '' : '/') + sessionId+'/');
});
  
module.exports = router;