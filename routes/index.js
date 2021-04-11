var express = require('express');
var router = express.Router();

const Set = require('../models/Set');
const Draft = require('../models/Draft');
const basic = require('../utils/basic');
const { defaultDraftName } = require('../config/definitions');
const { limits, draftSetupRules, validate } = require('../utils/validator');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const setList = await Set.getSetList()
  return res.render('index', {
    title: 'MtG Drafter',
    defaultName: defaultDraftName,
    sets: setList,
    limits: limits
  });

  /*cubeData.getCardList(testCards)
    .then( data => console.log(data))
    .catch(err => console.log("ERROR: "+err));
  */
});

router.post('/', draftSetupRules(), validate, async function(req, res, next) {
  
  // Booster settings
  let draftSettings;
  if(req.body.draftType == 'boosterType') {
    // Booster settings
    draftSettings = {
      playerCount: +req.body.playerCount,
      packLayout: Array.isArray(req.body.setCode) ? req.body.setCode : [req.body.setCode]
    };

  // Cube settings
  } else if (req.body.draftType == 'cubeType') {

    // Check cubeData (Eventually add to normalize methods)
    if (!req.body.cubeData) {
      console.error('Cube data is empty.');
      return res.send('No cube or an empty cube was uploaded for the cube draft.');
    }
    const cubeData = basic.dataCompress.b64ToObj(req.body.cubeData);
    if (!Array.isArray(cubeData) || !cubeData.length) {
      console.error('Cube data is invalid format.');
      return res.send('The cube list is invalid, please check the file.');
    }

    // Cube settings
    draftSettings = {
      playerCount: +req.body.playerCount,
      packCount: +req.body.packCount,
      packSize: +req.body.packSize,
      cubeData: cubeData
    };
  } else {
    // Error on input
    console.error('Draft type is invalid: '+req.body.draftType);
    return res.send('Error creating draft with these settings');
  }
  draftSettings.name = req.body.draftName == defaultDraftName ? '' : req.body.draftName;

  // Setup draft, set cookies and load draft page
  const newDraft = await Draft.newDraft(draftSettings);
  if (!newDraft) return res.send('Error starting draft, ensure your cube has enough cards.')
  const sessionId = newDraft.sessionId;
  newDraft.url = req.protocol+'://'+req.get('host')+'/draft/'+sessionId;
  await newDraft.save();
  res.cookie('sessionId', sessionId);
  res.cookie('playerId', basic.sessionId.url(newDraft.hostId));
  return res.redirect('/draft/'+sessionId);
});


module.exports = router;
