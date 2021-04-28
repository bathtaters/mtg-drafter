// ADMIN PANEL router

var express = require('express');
var router = express.Router();

const Draft = require('../../models/Draft');
const { sessionListData, sessionProjection } = require('../../controllers/shared/populateSession');
const Settings = require('../../models/Settings');
const setList = require('../../admin/setList');
const updateDb = require('../../admin/updateDb');
const { addSlash } = require('../../controllers/shared/middleware');
const { reply } = require('../../controllers/shared/basicUtils');



/* ----- GET Admin Panel page. ----- */

// Get page
router.get('/', addSlash, async function(req, res, next) {
  
  const panelData = await Promise.all([
    Draft.find({},sessionProjection).sort('-updatedAt') 
      .then(result => result.map(sessionListData)), // 0:sessionList
    setList.fullList(), // 1:sets
    Settings.get('defaultSet'), // 2:defaultSet
    updateDb.url.set(), // 3:url.set
    updateDb.url.card() // 4:url.card
  ])
  
  return res.render('panel', {
    title: 'Admin Panel - MtG Drafter',
    sessionList: panelData[0],
    sets: panelData[1],
    defaultSet: panelData[2],
    url: {set: panelData[3], card: panelData[4]}
  });

});





/* ----- POST set changes. ----- */

// Toggle set visibility
router.post('/sets/ToggleVisibility', async function(req, res, next) {
  let result = 'Invalid action.';
  const checkSet = await Settings.get('defaultSet');

  if (checkSet === req.body.setCode)
    console.error('Cannot toggle visibilty of default set: '+req.body.setCode);
  else result = await setList.setVisibility(req.body.setCode);
  
  return reply(res, {set: req.body.setCode || 'all', action: 'ToggleVisibility', result});
});

// Toggle set that starts in picker
router.post('/sets/MakeDefault', async function(req, res, next) {
  let result = 'Invalid action.';

  const checkSet = await setList.getVisibility(req.body.setCode);
  if (!checkSet) console.error(req.body.setCode+' is not a set or set is hidden.');  
  else result = await Settings.set('defaultSet',req.body.setCode);

  return reply(res, {set: req.body.setCode || 'all', action: 'MakeDefault', result});
});

// Append new sets to setList
router.post('/sets/UpdateAll', async function(req, res, next) {
  const result = await setList.updateSetList(
    req.body.defaultVisible === undefined ? true : +req.body.defaultVisible
  );
  return reply(res, {set: req.body.setCode || 'all', action: 'UpdateAll', result});
});

// Reset setList and all visibility
router.post('/sets/ResetAll', async function(req, res, next) {
  const result = await setList.resetSetList(
    req.body.defaultVisible === undefined ? true : +req.body.defaultVisible
  );
  return reply(res, {set: req.body.setCode || 'all', action: 'ResetAll', result});
});

// Catch other actions
router.post('/sets/:action', async function(req, res, next) {
  return reply(res, {
    set: req.body.setCode || 'all',
    action: req.params.action, error: 'Invalid action.'
  });
});





/* ----- POST MTGJSON db changes. ----- */

// Change MTG JSON urls
router.post('/db/updateUrl', async function(req, res, next) {
  let result = req.body.urlValue;

  if (req.body.urlKey === 'setUrl' && req.body.urlValue) {
    await updateDb.url.updateSet(req.body.urlValue);

  } else if (req.body.urlKey === 'cardUrl' && req.body.urlValue) {
    await updateDb.url.updateCard(req.body.urlValue);

  } else {
    result = 'Invalid URL key or no value given: '+req.body.urlKey+' = '+result;
    console.error('Set DB URL failed.', result);
    return reply(res, {error: result});
  }

  return reply(res, {action: 'updateUrl', result});
});

// Run a database update
router.post('/db/updateDb', async function(req, res, next) {
  result = await updateDb.update(
    req.body.updateSets === 'on',
    req.body.updateCards === 'on',
    req.body.skipCurrent === 'on',
    req.body.fixCardAlts === 'on'
  );
  return reply(res, {action: 'updateDb', result});
});

// Catch other actions
router.post('/db/:action', async function(req, res, next) {
  return reply(res, {action: req.params.action, error: 'Invalid action.'});
});



module.exports = router;