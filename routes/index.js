var express = require('express');
var router = express.Router();

const Set = require('../models/Set');
const fileOps = require('../admin/fileOps'); // TEMPORARY
const Draft = require('../models/Draft');
const basic = require('../utils/basic');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const string = '';
  const setList = await Set.getSetList()
  return res.render('index', { title: 'Test Page', text: string, sets: setList });

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
      packSize: +req.body.packSize
    };
    draftSettings.cubeData = await fileOps.testCube; // TEMPORARY
  } else {
    // Error on input
    console.error('Draft type is invalid: '+req.body.draftType);
    return res.send('Error creating draft with these settings');
  }

  // Setup draft, set cookies and load draft page
  const nextDraft = await Draft.newDraft(draftSettings);
  res.cookie('sessionId', nextDraft.sessionId);
  res.cookie('playerId', basic.sessionId.url(nextDraft.hostId));
  return res.redirect(307, '/draft');
});


module.exports = router;
