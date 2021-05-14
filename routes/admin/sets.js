const express = require('express');
const router = express.Router();

const Set = require('../../models/Set');
const Card = require('../../models/Card');
const Settings = require('../../models/Settings');
const setList = require('../../admin/setList');
const { sortedKeys } = require('../../config/definitions');
const { addSlash } = require('../../controllers/shared/middleware');
const { reply } = require('../../controllers/shared/basicUtils');
const fixDb = require('../../admin/fixDb');



/* ----- POST set actions ----- */

// Toggle set visibility
router.post('/ToggleVisibility', async function(req, res, next) {
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
router.post('/MakeDefault', async function(req, res, next) {
  let result = 'Invalid action.';

  const setData = await setList.getSetData(req.body.setCode);
  if (!setData.enabled) console.error(req.body.setCode+' is not a set or set is hidden.');
  else result = await Settings.set('defaultSet',req.body.setCode);

  return reply(res, {set: req.body.setCode || 'all', action: 'MakeDefault', result});
});

// Append new sets to setList
router.post('/UpdateAll', async function(req, res, next) {
  const result = await setList.updateSetList(
    req.body.defaultVisible === undefined ? true : +req.body.defaultVisible
  );
  return reply(res, {set: req.body.setCode || 'all', action: 'UpdateAll', result});
});

// Reset setList and all visibility
router.post('/ResetAll', async function(req, res, next) {
  const result = await setList.resetSetList(
    req.body.defaultVisible === undefined ? true : +req.body.defaultVisible
  );
  return reply(res, {set: req.body.setCode || 'all', action: 'ResetAll', result});
});

/* Redirect empty POST request as GET. */
router.post('/', addSlash, function(req, res, next) {
  console.log('POST to /set w/o action - Redirecting to set/setCode');
  if (!req.body.sets && !req.body.setCode) return res.send('No set data sent');
  if (Array.isArray(req.body.sets)) req.body.sets = req.body.sets[0];
  return res.redirect('./' + (req.body.setCode || req.body.sets) + '/');
});






/* ----- GET set detail papges ----- */

// Base setDetail page
router.get('/:setCode', addSlash, async function(req, res, next) {
    // Lookup Set Data
    let setData = await Set.findById(req.params.setCode,'-sheets');
    if (!setData) res.send(req.params.setCode+' set not found.');
    setData = setData.toObject();
  
    // Lookup additional data
    const setDetail = await Promise.all([
      setList.getSetData(req.params.setCode), // 0:listData
      Settings.get('defaultSet') // 1:defaultSet
    ]);

    // Combine data into array
    const isDefault = setDetail[1] == setData.code;
    setData = { isDefault, ...setDetail[0], ...setData };
    
    // Get sorted list of keys
    const setDataKeys = sortedKeys(Object.keys(setData),'set');
    
    return res.render('setDetail', {
      title: 'Admin Panel - '+req.params.setCode+' Detail',
      setData, setDataKeys
    });
});



// All cards in set page
const cardProj = 'name noGath gathererImg colors types';
const cardDataObj = ({uuid, name, noGath, gathererImg, bgdColor}) => ({uuid, name, noGath, gathererImg, bgdColor}); 
router.get('/:setCode/all', addSlash, async function(req, res, next) {
    let setData = await Set.findById(req.params.setCode,'name');
    if (!setData) res.send(req.params.setCode+' set not found.');

    // Get all card names
    let cardData = await Card.find({setCode: req.params.setCode}, cardProj);
    cardData = cardData.map(cardDataObj);

    return res.render('sheetDetail', {
        title: 'Admin Panel - '+req.params.setCode+':All Detail',
        set: { name: setData.name, code: setData.code },
        sheetData: { cards: cardData },
        sheetDataKeys: []
      });
});


// All cards from sheet in set page
const sheetDataKeys = ['foil', 'balanceColors','totalWeight'];
router.get('/:setCode/:sheet', addSlash, async function(req, res, next) {
    let setData = await Set.findById(req.params.setCode,'name sheets');
    if (!setData) res.send(req.params.setCode+' set not found.');
    let sheetData = setData.sheets.find(sheet => sheet.name == req.params.sheet);
    if (!sheetData) res.send(req.params.setCode+':'+req.params.sheet+' sheet not found.');

    // Lookup card names
    sheetData = sheetData.toObject();
    sheetData.cards = await Promise.all(sheetData.cards.map(async card => {
        const cardData = await Card.findById(card.card, cardProj);
        return {...cardDataObj(cardData), uuid: card.card, weight: card.weight};
    }));

    return res.render('sheetDetail', {
        title: 'Admin Panel - '+req.params.setCode+':'+req.params.sheet+' Detail',
        set: { name: setData.name, code: setData.code },
        sheetData, sheetDataKeys
      });
});

// ------- Set changes

// Edit DB - post {key, value}
router.post('/:setCode/db/set', async function(req, res, next) {
  let value = req.body.value;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      value = req.body.value.toString();
    }
  }
  await fixDb.setDb(Set.modelName, req.params.setCode, req.body.key, value);
  return reply(res, {key: req.body.key, value});
});

// Clear DB Edit - post {key} (Will not remove from DB until next download)
router.post('/:setCode/db/clear', async function(req, res, next) {
  await fixDb.clearSetting(Set.modelName, req.params.setCode, req.body.key);
  return reply(res, {key: req.body.key, cleared: true});
});


module.exports = router;
