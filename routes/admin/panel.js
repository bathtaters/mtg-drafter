

var express = require('express');
var router = express.Router();

const Draft = require('../../models/Draft');
const { dateMMDDYY, reply, convert } = require('../../controllers/shared/basicUtils');
const populatePacks = require('../../controllers/shared/populatePacks');

// Session Data filterer
const sessionListFilter = 'name players round packs hostId updatedAt';
const sessionListData = ({
  sessionId, name, players, status,
  round, updatedAt, hostId, url
}) => ({
  sessionId, name, status, round,
  hostId, url,
  playerCount: players.length,
  date: updatedAt.toLocaleDateString(),
  time: updatedAt.toLocaleTimeString()
});

const playerData = ({ players, hostId }) => Promise.all(players.map(async ({
  _id, name, position, connected, pick, cards,
  cookieId, isDrafting, opponent, packsHeld,
  getLandData, getLandTotal
}) => {
  const main = await populatePacks.all(cards.main);
  const side = await populatePacks.all(cards.side);
  const countLands = board => cards.basicLands.reduce((sum,data) =>
    (!board || data._id.includes(board)) ? sum + data.count : sum,
  0);
  return {
    cookieId, name, position, connected,
    isHost: hostId.toString() == _id.toString(),
    isDrafting, pick, packsHeld,
    opponent: opponent ? { name: opponent.name, id: opponent.cookieId } : 0,
    lands: cards.basicLands,
    landCount: {main: countLands('main'), side: countLands('side')},
    deck: {main, side}
  };
}));

// Get date for N days before today
const daysAgo = days => {
  let d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/* GET Panel page. */
router.get('/', async function(req, res, next) {
const sessionList = await Draft.find({},sessionListFilter).sort('-updatedAt')
    .then(result => result.map(sessionListData));
  
  return res.render('panel', {
    title: 'Admin Panel - MtG Drafter',
    sessionList
  });

});

/* GET Session detail. */
router.get('/session/:sessionId', async function(req, res, next) {
  const session = await Draft.findBySessionId(req.params.sessionId);
  if (!session) return res.send('Session "'+req.params.sessionId+'" does not exist.');

  const players = await playerData(session);
  return res.render('session', {
    title: 'Admin - '+session.name,
    session: sessionListData(session),
    players: players
  });
});

/* Make changes. */
router.post('/session/:sessionId/:action', async function(req, res, next) {
  
  // TODO: CHECK THERE IS A SESSION ID

  // Remove based on sessionId
  if (req.params.action == 'Delete') {
    const session = await Draft.findBySessionId(req.params.sessionId,'_id');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});
    session.deleteOne();

  // Remove based on date
  } else if (req.params.action == 'Clear') {
    const sessions = await Draft.find({updatedAt: {$lte: daysAgo(req.body.clearDays)}},'_id')
    const sessionIds = sessions.map(session => {
      session.deleteOne(); return session.sessionId;
    });
    
    return reply(res, {sessionIds: sessionIds, action: req.params.action});
  
  // Disconnect all players
  } else if (req.params.action == 'Disconnect') {
    const session = await Draft.findBySessionId(req.params.sessionId,'players');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});

    await session.disconnectAll();
    return reply(res, {sessionId: req.params.sessionId, disconnected: session.players.every(p => !p.connected)})
  
  // Disconnect a single player
  } else if (req.params.action == 'PlayerDisconnect') {
    const session = await Draft.findBySessionId(req.params.sessionId,'players');
    if (!session) return reply(res, {error:'Session "'+req.params.sessionId+'" does not exist.'});

    const player = await session.findPlayerByCookie(req.body.playerId,'connected');
    if (!player) return reply(res, {
      sessionId: req.params.sessionId,
      error:'Player "'+req.body.playerId+'" does not exist.'
    });

    player.connected = false; await session.save();
    return reply(res, {sessionId: req.params.sessionId, playerId: req.body.playerId, disconnected: !player.connected})
  }

  return reply(res, {sessionId: req.params.sessionId, action: req.params.action});
});

// Forward session "post" to session URL
router.post('/session', async function(req, res, next) {
  console.log('Redirecting to: '+req.body.sessionId);
  res.redirect(req.originalUrl+'/'+req.body.sessionId+'/');
});

module.exports = router;