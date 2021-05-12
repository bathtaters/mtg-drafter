/* Action server */

var express = require('express');
var router = express.Router();
const fileOps = require('../../controllers/draft/fileOps');
const { draftStatus } = require('../../config/definitions');
const { convert, reply } = require('../../controllers/shared/basicUtils');
const { draftRules, validate } = require('../../config/validator');


// ----------------- Upload file, return data
router.post('/upload', async function(req, res, next) {
  if (!req.files || !req.files.cubeFile) return reply(res, {error: 'No files were sent'});
  
  const cubeData = await fileOps.import(req.files.cubeFile);
  return reply(res, {
    cardData: convert.objToB64(cubeData.cards),
    cardCount: cubeData.cards.length,
    missing: cubeData.missing
  });
});

// ----------------- Swap cards to/from Sideboard
router.post('/swap', draftRules.swap(), validate, async function(req, res, next) {
  if (!req.body.player || !('draftId' in req.body)) return reply(res);

  const moveTo = await req.body.player.swapBoard(req.body.draftId, req.body.fromSide);
  if (moveTo) return reply(res, {moveTo: moveTo});
});

// ----------------- Rename player
router.post('/rename', draftRules.rename(), validate, async function(req, res, next) {
  if (!req.body.player || !('name' in req.body)) return reply(res);
  
  const newName = req.body.name.replace(/(\r?\n)+/g,' ').substring(0,22);
  if (newName.trim()) {

    if (newName != req.body.player.name)
      await req.body.session.log(req.body.player.identifier+' renamed "'+newName+'".');

    req.body.player.name = newName;
    await req.body.session.save();

  } else if (!req.body.player.name.trim()) {

    if (newName != req.body.player.name)
      await req.body.session.log(req.body.player.identifier+' reset name to Player '+req.body.player.position+'.');

    req.body.player.name = 'Player '+req.body.player.position;
  }
  return reply(res, {name: req.body.player.name});

});

// ----------------- Download Decklist
router.get('/download', async function(req, res, next) {
  if (!req.body.player) return reply(res);

  const deckText = await fileOps.export(req.body.player.cards);
  const filename = req.body.player.name+' - '+req.body.session.name+' Deck.txt'
  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition':'attachment; filename="'+filename+'"'
  });
  await req.body.session.log(req.body.player.identifier+' downloaded deck list.');
  return res.send(deckText);
});

// ----------------- Set basic land count
router.post('/lands', draftRules.lands(), validate, async function(req, res, next) {
  if (!req.body.player || !req.body.landCount) return reply(res);

  await req.body.player.setLandData(req.body.landCount);
  return reply(res, {lands: req.body.player.getLandData()});
});

// ----------------- Auto-set basic land count
router.get('/autoLands', async function(req, res, next) {
  if (!req.body.player) return reply(res);

  await req.body.player.setAutoLands();
  // console.log(req.body.player.getLandData());
  return reply(res, {lands: req.body.player.getLandData()});
});

// ----------------- Poll for full room / available packs
router.get('/isReady', function(req, res, next) {
  if (!req.body.session) return reply(res);
  return reply(res,{ refresh: req.body.session.status != draftStatus.pre });
});
router.get('/packReady', function(req, res, next) {
  if (!req.body.player) return reply(res);
  return reply(res,{
    refresh: req.body.session.status == draftStatus.post || req.body.player.packsHeld
  });
});


module.exports = router;
