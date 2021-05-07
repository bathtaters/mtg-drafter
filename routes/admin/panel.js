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
const users = require('../../admin/pword');


/* ----- GET Admin Panel page. ----- */

// Get page
router.get('/', addSlash, async function(req, res, next) {
  
  const panelData = await Promise.all([
    Draft.find({},sessionProjection).sort('-updatedAt') 
      .then(result => result.map(sessionListData)), // 0:sessionList
    setList.fullList(), // 1:sets
    Settings.get('defaultSet'), // 2:defaultSet
    updateDb.url.set(), // 3:url.set
    updateDb.url.card(), // 4:url.card
    updateDb.getCounts(), // 5:dbCount
    users.userList() // 6:user.list
  ]);
  
  return res.render('panel', {
    title: 'Admin Panel - MtG Drafter',
    sessionList: panelData[0],
    sets: panelData[1],
    defaultSet: panelData[2],
    url: {set: panelData[3], card: panelData[4]},
    dbCount: panelData[5],
    user: { current: req.auth.user, isSuper: req.auth.user === 'nick', list: panelData[6] }
  });

});

// Logout
router.get('/logout', function(req, res, next) {
  console.log('Logout: '+req.auth.user);
  res.status(401).send('You are logged out.');
});



/* ----- POST set changes. ----- */

// Toggle set visibility
router.post('/sets/ToggleVisibility', async function(req, res, next) {
  const checkSet = await Settings.get('defaultSet');

  const results = await Promise.all(
    req.body.setCodes.map( setCode => {
      if (checkSet !== setCode) return setList.setVisibility(setCode);
      console.error('Cannot toggle visibilty of default set: '+setCode);  
      return Promise.resolve(-2);
    })
  );
  
  return reply(res, {set: req.body.setCodes, action: 'ToggleVisibility', results});
});

// Toggle set that starts in picker
router.post('/sets/MakeDefault', async function(req, res, next) {
  let result = 'Invalid action.';

  const setData = await setList.getSetData(req.body.setCode);
  if (!setData.enabled) console.error(req.body.setCode+' is not a set or set is hidden.');
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





/* ----- POST User table changes. ----- */

// Update Password
router.post('/user/pass', async function(req, res, next) {
  if (!req.body.currentPassword) 
    return reply(res, {result:'Update failed: Must enter old password.', error: 'No password provided'});

  const err = await users.updateUser(req.auth.user, req.body.newPassword, req.body.currentPassword);
  console.log('updated pword?',err)
  const result = {
    msg: err ? 'Failed to update password: '+err : 'Successfully updated password',
    error: err
  }
  return reply(res, result);
});

// Add User
router.post('/user/add', async function(req, res, next) {
  const err = await users.updateUser(req.body.addUsername, req.body.addPassword, false);
  
  const result = {
    msg: err ? 'Failed to add user: '+err : 'Successfully added user: '+req.body.addUsername,
    error: err
  }
  
  return reply(res, result);
});

// Remove User
router.post('/user/remove', async function(req, res, next) {
  const err = await users.removeUser(req.body.username);
  
  const result = {
    msg: err ? 'Failed to add user: '+err : 'Successfully added user: '+req.body.addUsername,
    error: err
  }
  
  return reply(res, result);
});

// Catch other actions
router.post('/user/:action', async function(req, res, next) {
  return reply(res, {action: req.params.action, error: 'Invalid action.'});
});



module.exports = router;