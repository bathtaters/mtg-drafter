// ADMIN PANEL - SESSION DETAILS router

var express = require('express');
var router = express.Router();

const Draft = require('../../models/Draft');
const { sessionListData, playerData } = require('../../controllers/shared/populateSession');
const { addSlash, sessionObjs } = require('../../controllers/shared/middleware');
const { daysAgo } = require('../../controllers/shared/basicUtils');
const fileOps = require('../../controllers/draft/fileOps');
const asyncPool = require('tiny-async-pool');

  
   

/* ----- GET Session Detail page. ----- */

// Get page
router.get('/:sessionId', addSlash, async function(req, res, next) {
    const session = await Draft.findById(req.params.sessionId);
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
router.post('/:sessionId/Delete', sessionObjs, async function(req, res, next) {
    const sessionId = await Draft.findByIdAndDelete(req.body.session._id).then(s=>s ? s._id : s);
    return res.reply({sessionId: sessionId, action: 'Delete'});
});

// Remove based on date
router.post('/:sessionId/Clear', async function(req, res, next) {
    const sessions = await Draft.find({updatedAt: {$lte: daysAgo(req.body.clearDays)}}, '_id')
        .then(res=>res.map(s=>s._id));
    const sessionIds = await asyncPool(100, sessions, sessionId => 
        Draft.findByIdAndDelete(sessionId).then(session => session ? session._id : session)
    );

    // let session = true, sessionIds = [];
    // while (session) {
    //     session = await Draft.findOneAndDelete({updatedAt: {$lte: daysAgo(+req.body.clearDays + 1)}});
    //     session && sessionIds.push(session._id);
    // }
    
    return res.reply(sessionIds.map(sessionId => ({sessionId, action: 'Clear'})));
});

// Disconnect all players
router.post('/:sessionId/Disconnect', sessionObjs, async function(req, res, next) {
    await req.body.session.disconnectAll(req.auth.user);

    return res.reply({
        sessionId: req.body.session.sessionId,
        disconnected: req.body.session.players.every(p => !p.connected)
    });
});
    
// Disconnect a single player
router.post('/:sessionId/PlayerDisconnect', sessionObjs, async function(req, res, next) {
    if (!req.body.player) return res.reply({
      sessionId: req.params.sessionId,
      error:'Player "'+req.body.playerId+'" does not exist.'
    });

    await req.body.player.disconnect(req.auth.user);

    return res.reply({
        sessionId: req.body.session.sessionId,
        playerId: req.body.player.cookieId,
        disconnected: !req.body.player.connected
    });
});

// Download player deck list
router.get('/:sessionId/player/:playerId/downloadDeck', sessionObjs, async function(req, res, next) {
    if (!req.body.player) return res.send('Player "'+req.params.playerId+'" does not exist.');

    const deckText = await fileOps.export(req.body.player.cards);
    const filename = req.body.player.name+' - '+req.body.session.name+' Deck.txt'
    res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition':'attachment; filename="'+filename+'"'
    });
    
    await req.body.session.log('Admin ('+req.auth.user+') downloaded deck list of '+req.body.player.identifier+'.');
    return res.send(deckText);
});


// Catch other actions
router.post('/:sessionId/:action', async function(req, res, next) {
    return res.reply({sessionId: req.params.sessionId, action: req.params.action, error: 'Invalid action.'});
});
  



// Forward initial session POST to session/id GET
router.post('/', async function(req, res, next) {
    let sessionId = req.body.sessionId;
    if(!sessionId) return res.send('No sessionId posted.');
    if(Array.isArray(sessionId)) sessionId = sessionId[0];
    console.log('Redirecting to: '+sessionId);
    return res.redirect(req.originalUrl + (req.originalUrl.endsWith('/') ? '' : '/') + sessionId+'/');
});
  
module.exports = router;