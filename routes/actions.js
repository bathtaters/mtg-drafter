/* Action server */

var express = require('express');
var router = express.Router();
const fileOps = require('../admin/fileOps');
const { draftStatus } = require('../config/definitions');
const basic = require('../utils/basic');

const reply = (res, data={}) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
}

// Upload file, return data
router.post('/upload', async function(req, res, next) {
  if (!req.files || !req.files.cubeFile) return reply(res, {error: 'No files were sent'});
  
  const cubeData = await fileOps.import(req.files.cubeFile);
  return reply(res, {
    cardData: basic.dataCompress.objToB64(cubeData.cards),
    cardCount: cubeData.cards.length,
    missing: cubeData.missing
  });
});

// Swap cards to/from Sideboard
router.post('/swap', async function(req, res, next) {
  if (!req.body.player || !('draftId' in req.body)) return reply(res);

  const moveTo = await req.body.player.swapBoard(req.body.draftId, req.body.fromSide);
  if (moveTo) return reply(res, {moveTo: moveTo});
});

// Rename player
router.post('/rename', async function(req, res, next) {
  if (!req.body.player || !('name' in req.body)) return reply(res);
  
  const newName = req.body.name.replace(/(\r?\n)+/g,' ').substring(0,22);
  if (newName.trim()) {
    req.body.player.name = newName;
    await req.body.session.save();
  }
  return reply(res, {name: req.body.player.name});

});

// Download Decklist
router.get('/download', async function(req, res, next) {
  if (!req.body.player) return reply(res);

  const deckText = await fileOps.export(req.body.player.cards);
  const filename = req.body.player.name+' - '+req.body.session.name+' Deck.txt'
  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition':'attachment; filename="'+filename+'"'
  });
  console.log(req.body.player._id+' downloaded deck list.');
  return res.send(deckText);
});

// Set basic land count
router.post('/lands', async function(req, res, next) {
  if (!req.body.player) return reply(res);

  let landData = {}
  for (const key in req.body) {
    if (/(main|side)-\w/.test(key)) landData[key] = req.body[key];
  }
  
  await req.body.player.setLandData(landData);
  return reply(res, req.body.player.getLandData());
});

// Poll for full room / available packs
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
