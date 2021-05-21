// ADMIN PANEL router

var express = require('express');
var router = express.Router();

const Draft = require('../../models/Draft');
const { sessionListData, sessionProjection } = require('../../controllers/shared/populateSession');
const Settings = require('../../models/Settings');
const setList = require('../../admin/setList');
const updateDb = require('../../admin/updateDb');
const { addSlash, makeBusy } = require('../../controllers/shared/middleware');
const users = require('../../admin/pword');
const fixDb = require('../../admin/fixDb');


/* ----- GET Admin Panel page. ----- */

// Get page
const sudoList = ['nick'];
const sessionSort = (a, b) => b.sortVal - a.sortVal;
router.get('/', addSlash, async function(req, res, next) {
  
  const panelData = await Promise.all([
    Draft.find({},sessionProjection) // 0:sessionList
      .then(result => result.map(sessionListData).sort(sessionSort)), 
    setList.fullList(), // 1:sets
    Settings.get('defaultSet'), // 2:defaultSet
    updateDb.url.set(), // 3:url.set
    updateDb.url.card(), // 4:url.card
    updateDb.getMetadata(), // 5:dbMeta
    users.userList(), // 6:user.list
    fixDb.testSettings() // 7:fixInfo
  ]);
  
  return res.render('panel', {
    title: 'Admin Panel - MtG Drafter',
    sessionList: panelData[0],
    sets: panelData[1],
    defaultSet: panelData[2],
    url: {set: panelData[3], card: panelData[4]},
    dbInfo: panelData[5],
    user: {
      current: req.auth.user, list: panelData[6],
      isSuper: sudoList.includes(req.auth.user.toLowerCase())
    },
    fixInfo: {
      applied: panelData[7] ? Object.keys(panelData[7]).reduce((a,k)=>a+panelData[7][k], 0) : 0,
      total: panelData[7] ? Object.keys(panelData[7]).length : 0
    },
    busy: req.body.busy
  });

});

// Just Session panel
router.get('/draftsList', async function(req, res, next) {
  const sessionList = await Draft.find({},sessionProjection) 
    .then(result => result.map(sessionListData).sort(sessionSort))
  return res.render('draftsList', { sessionList });
});

// Just Sets panel
router.get('/setsList', async function(req, res, next) {
  const sets = await setList.fullList();
  const defaultSet = Settings.get('defaultSet');
  return res.render('setsList', { sets, defaultSet });
});

// Logout
router.get('/logout', function(req, res, next) {
  console.log('Logout: '+req.auth.user);
  res.status(401).send('You are logged out.');
});



/* ----- POST MTGJSON db changes. ----- */

// Change MTG JSON urls
router.post('/db/updateUrl', makeBusy, async function(req, res, next) {
  let result = req.body.urlValue;

  if (req.body.urlKey === 'setUrl' && req.body.urlValue) {
    await updateDb.url.updateSet(req.body.urlValue);

  } else if (req.body.urlKey === 'cardUrl' && req.body.urlValue) {
    await updateDb.url.updateCard(req.body.urlValue);

  } else {
    result = 'Invalid URL key or no value given: '+req.body.urlKey+' = '+result;
    console.error('Set DB URL failed.', result);
    return res.reply({error: result});
  }

  return res.reply({action: 'updateUrl', result});
});

// Run a database update
router.post('/db/updateDb', makeBusy, async function(req, res, next) {
  const result = await updateDb.update(
    req.body.updateSets === 'on',
    req.body.updateCards === 'on',
    req.body.skipCurrent === 'on',
    req.body.fixCardAlts === 'on',
    false // don't auto-apply fixes (Can apply them in 'Fixes info')
  );
  return res.reply({action: 'updateDb', result});
});

// Catch other actions
router.post('/db/:action', async function(req, res, next) {
  return res.reply({action: req.params.action, error: 'Invalid action.'});
});





/* ----- POST User table changes. ----- */

// Update Password
router.post('/user/pass', async function(req, res, next) {
  if (!req.body.currentPassword) 
    return res.reply({result:'Update failed: Must enter old password.', error: 'No password provided'});

  const err = await users.updateUser(req.auth.user, req.body.newPassword, req.body.currentPassword);
  console.log('updated pword?',err)
  const result = {
    msg: err ? 'Failed to update password: '+err : 'Successfully updated password',
    error: err
  }
  return res.reply(result);
});

// Add User
router.post('/user/add', async function(req, res, next) {
  const err = await users.updateUser(req.body.addUsername, req.body.addPassword, false);
  
  const result = {
    msg: err ? 'Failed to add user: '+err : 'Successfully added user: '+req.body.addUsername,
    error: err
  }
  
  return res.reply(result);
});

// Remove User
router.post('/user/remove', async function(req, res, next) {
  const err = await users.removeUser(req.body.username);
  
  const result = {
    msg: err ? 'Failed to add user: '+err : 'Successfully added user: '+req.body.addUsername,
    error: err
  }
  
  return res.reply(result);
});

// Catch other actions
router.post('/user/:action', async function(req, res, next) {
  return res.reply({action: req.params.action, error: 'Invalid action.'});
});



module.exports = router;