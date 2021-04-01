var express = require('express');
const { draftStatus } = require('../config/definitions');
const basic = require('../utils/basic');
const populatePack = require('../utils/populatePacks');
var router = express.Router();



/* GET draft view. */
router.get('/:sessionId?', async function(req, res, next) {
  const session = req.body.session, player = req.body.player;

  // go back if no session or report error if server is full
  if (!session) return res.redirect('../');
  if (!player) return res.send('This server is full.');
  
  if (session.status == draftStatus.pre && !session.nextOpenPlayer)
    session.startDraft();

  console.log('Loaded session: '+session._id+', '+(player.cookieId == req.cookies.playerId ? 'existing ':'new ')+'player: '+player.name+' <'+player._id+'>.');
  //return res.send('Loaded session: '+session.sessionId+', '+(player.cookieId == req.cookies.playerId ? 'existing ':'new ')+'player: '+player.name+' <'+player.cookieId+'>.');

  // Build object to send to Pug
  const renderData = await populatePack.draftOnly(session,player);
  return res.render('draft', renderData);

});

/* POST draft action */
router.post('/:sessionId?', async function(req, res, next) {

  if (req.body.button == "Pick Card" && req.body.draftId) {
    req.body.player.pickCard(req.body.draftId);
  } else {
    console.error('Other POSTS not set')
  }
  basic.log.all(req.body.session);
  return res.redirect(req.originalUrl); // refresh page as GET
  }
);

module.exports = router;
