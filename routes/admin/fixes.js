const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { editDisable, sortedKeys } = require('../../config/definitions');
const { addSlash, formatFixValue } = require('../../controllers/shared/middleware');
const { reply } = require('../../controllers/shared/basicUtils');
const fixDb = require('../../admin/fixDb');


/* GET fixes page. */
router.get('/', addSlash, async function(req, res, next) {  

  // Lookup fix data
  const fixList = await fixDb.getSettings();
  const fixActive = await fixDb.testSettings();
  
  return res.render('fixDetail', {
      title: 'Card Fixes',
      fixList, fixActive
  });
    
});



// ------ Fix Fetches

// Fetch card data
router.post('/editor/card', async function(req, res, next) {
  const card = await Card.findById(req.body.uuid).then(d => d && d.toObject());
  if (!card) return reply(res,{uuid: req.body.uuid, invalid: true});

  const keys = sortedKeys(Object.keys(card),'card')
    .filter( key => key != 'br' && !editDisable.card.includes(key) );
  return reply(res, {keys, card});
});

// Fetch setting data
router.post('/editor/setting', async function(req, res, next) {
  const setting = await fixDb.getSetting(req.body.key, req.body.id);
  if (!setting) return reply(res, {result: 'Setting '+req.body.key+' not found.', invalid: true});
  return reply(res, setting)
});



// ------ Fix Actions

// Edit DB - post {uuid, key, value}
router.post('/set', formatFixValue, async function(req, res, next) {
  await fixDb.setDb(Card.modelName, req.body.uuid, req.body.key, req.body.value);
  return reply(res, {...req.body, set: true});
});

// Clear DB Edit - post [keys] (Will not remove from DB until next download)
router.post('/clear', async function(req, res, next) {
  for (const key of req.body.keys) {
    await fixDb.clearSetting(key);
  }
  return reply(res, {keys: req.body.keys, cleared: true});
});

// Apply all DB edits to DB
router.post('/applyAll', async function(req, res, next) {
  await fixDb.applySettings();
  return reply(res, {...req.body, applied: true});
});

// Apply all DB edits to DB
router.post('/revertAll', async function(req, res, next) {
  await fixDb.applySettings(true);
  return reply(res, {...req.body, applied: true});
});

// Remove all DB edits
router.post('/clearAll', async function(req, res, next) {
  await fixDb.clearAll();
  return reply(res, {...req.body, cleared: true});
});

const currTimestamp = () => new Date().toJSON().replace(/\.\d+[A-Z]$/,'')
  .replace(/[-:.]/g,'').replace(new Date().getFullYear().toString(),'')
  .replace('T',(new Date().getFullYear() % 100)+'_');

// Export file
router.get('/export/FixList.json', async function(req, res, next) {
  const settings = await fixDb.getSettings(false).then(JSON.stringify);
  const filename = 'FixList_'+currTimestamp()+'.json'
  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition':'attachment; filename="'+filename+'"'
  });
  return res.send(settings);
});

// Import file
router.post('/import', async function(req, res, next) {
  if (!req.files || !req.files.fixList) return reply(res, {error: 'No files were sent'});
  
  const count = await fixDb.importSettings(JSON.parse(req.files.fixList.data));

  return reply(res,{imported: true, files: count});
});

module.exports = router;

