var express = require('express');
var router = express.Router();

const Set = require('../models/Set');
const fileOps = require('../admin/fileOps'); // TEMPORARY
const Draft = require('../models/Draft');
const basic = require('../utils/basic');
const { defaultDraftName } = require('../config/definitions');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const setList = await Set.getSetList()
  return res.render('index', { title: 'MtG Drafter – New Draft', defaultName: defaultDraftName, sets: setList });

  /*cubeData.getCardList(testCards)
    .then( data => console.log(data))
    .catch(err => console.log("ERROR: "+err));
  */
});

router.post('/', async function(req, res, next) {
  
  // Get settings from user
  let draftSettings;
  if(req.body.draftType == 'boosterType') {
    // Booster settings
    draftSettings = {
      playerCount: +req.body.playerCount,
      packLayout: Array.isArray(req.body.setCode) ? req.body.setCode : [req.body.setCode]
    };
  } else if (req.body.draftType == 'cubeType') {
    // Cube settings
    draftSettings = {
      playerCount: +req.body.playerCount,
      packCount: +req.body.packCount,
      packSize: +req.body.packSize,
      cubeData: basic.dataCompress.b64ToObj(req.body.cubeData)
    };
  } else {
    // Error on input
    console.error('Draft type is invalid: '+req.body.draftType);
    return res.send('Error creating draft with these settings');
  }
  draftSettings.name = req.body.draftName == defaultDraftName ? '' : req.body.draftName;

  // Setup draft, set cookies and load draft page
  const nextDraft = await Draft.newDraft(draftSettings);
  if (!nextDraft) return res.send('Error starting draft, ensure your cube has enough cards.')
  nextDraft.url = req.protocol+'://'+req.get('host')+'/draft/'+nextDraft.sessionId;
  await nextDraft.save();
  res.cookie('sessionId', nextDraft.sessionId);
  res.cookie('playerId', basic.sessionId.url(nextDraft.hostId));
  return res.redirect(307, '/draft');
});


module.exports = router;
