const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { editDisable, sortedKeys } = require('../../config/definitions');
const { addSlash, formatFixValue, makeBusy } = require('../../controllers/shared/middleware');
const fixDb = require('../../admin/fixDb');


/* GET fixes page. */
router.get('/', addSlash, async function(req, res, next) {  

  // Lookup fix data
  const fixList = await fixDb.getSettings(true);
  const fixActive = await fixDb.testSettings();
  
  return res.render('fixDetail', {
      title: 'Card Fixes',
      fixList, fixActive,
      busy: req.body.busy
  });
    
});



// ------ Fix Fetches

// Fetch card data
router.post('/editor/card', async function(req, res, next) {
  const card = await Card.findById(req.body.uuid).then(d => d && d.toObject());
  if (!card) return res.reply({uuid: req.body.uuid, invalid: true});

  const keys = sortedKeys(Object.keys(card),'card')
    .filter( key => key != 'br' && !editDisable.card.includes(key) );
  return res.reply({keys, card});
});

// Fetch setting data
router.post('/editor/setting', async function(req, res, next) {
  const setting = await fixDb.getSetting(req.body.key, req.body.id);
  if (!setting) return res.reply({result: 'Setting '+req.body.key+' not found.', invalid: true});
  return res.reply(setting)
});



// ------ Fix Actions

// Edit DB - post {uuid, key, value}
router.post('/set', formatFixValue, makeBusy, async function(req, res, next) {
  await fixDb.setDb(Card.modelName, req.body.uuid, req.body.key, req.body.value, req.body.note);
  return res.reply({...req.body, set: true});
});

// Bulk edit notes - post {keys, note}
router.post('/rename', async function(req, res, next) {
  if (!req.body.keys) return res.reply({error: 'No keys provided'});
  const note = (req.body.note || '').toString();

  let fixed = [];
  for (const key of req.body.keys) {
    const next = await fixDb.changeNote(note, key);
    if (next) fixed.push(next.id+'.'+next.key);
  }
  return res.reply({keys: fixed, renamed: fixed.length});
});

// Move a setting - post {offset, key}
router.post('/move', formatFixValue, async function(req, res, next) {
  const index = await fixDb.moveSetting(req.body.offset, req.body.key);
  return res.reply({...req.body, index, moved: true});
});

// Clear DB Edit - post [keys] (Will not remove from DB until next download)
router.post('/clear', makeBusy, async function(req, res, next) {
  if (!req.body.keys) return res.reply({error: 'No keys provided'});
  let fixed = [];
  for (const key of req.body.keys) {
    const next = await fixDb.clearSetting(key);
    if (next) fixed.push(next.id+'.'+next.key);
  }
  return res.reply({keys: fixed, cleared: fixed.length});
});

// Apply all DB edits to DB
router.post('/applyAll', makeBusy, async function(req, res, next) {
  const count = await fixDb.applySettings();
  return res.reply({...req.body, applied: count});
});

router.get('/applyAll', addSlash, async function(req, res, next) {
  if (req.body.busy)
    return res.reply({alert:["Cannot apply: Admin server is busy.","../../"]});
  await fixDb.applySettings();
  return res.redirect('../../');
});

// Apply all DB edits to DB
router.post('/revertAll', makeBusy, async function(req, res, next) {
  const count = await fixDb.applySettings(true);
  return res.reply({...req.body, reverted: count});
});

// Remove all DB edits
router.post('/clearAll', makeBusy, async function(req, res, next) {
  const count = await fixDb.applySettings(true);
  await fixDb.clearAll();
  return res.reply({...req.body, cleared: count});
});

const currTimestamp = () => new Date().toJSON().replace(/\.\d+[A-Z]$/,'')
  .replace(/[-:.]/g,'').replace(new Date().getFullYear().toString(),'')
  .replace('T',(new Date().getFullYear() % 100)+'_');

// Export file
router.get('/export/FixList.json', async function(req, res, next) {
  const settings = await fixDb.getSettings().then(JSON.stringify);
  const filename = 'FixList_'+currTimestamp()+'.json'
  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition':'attachment; filename="'+filename+'"'
  });
  return res.send(settings);
});

// Import file
router.post('/import', makeBusy, async function(req, res, next) {
  if (!req.files || !req.files.fixList) return res.reply({error: 'No files were sent'});
  
  const count = await fixDb.importSettings(JSON.parse(req.files.fixList.data));

  return res.reply({imported: true, files: count});
});

module.exports = router;

