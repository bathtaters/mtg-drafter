const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { editDisable, sortedKeys } = require('../../config/definitions');
const { addSlash, formatFixValue, makeBusy } = require('../../controllers/shared/middleware');
const fixDb = require('../../admin/fixDb');


/* GET cardDetail page. */
router.get('/:uuid([^/]{36})', addSlash, async function(req, res, next) {  
    
    // Missing param
    if (!req.params.uuid) {
        console.error('cardDetail called w/o card.');
        res.redirect('../../');
    }

    // Lookup card data
    const cardData = await Card.findById(req.params.uuid).then(d => d && d.toObject());
    if (!cardData) return res.send('No card data for: '+req.params.uuid);

    // Get sorted list of keys
    const cardDataKeys = sortedKeys(Object.keys(cardData),'card');

    // Lookup fix data
    const fixData = await fixDb.testSettings(req.params.uuid);

    return res.render('cardDetail', {
        title: cardData.printedName || cardData.name,
        cardData: cardData,
        cardDataKeys, fixData,
        editDisable: editDisable.card,
        busy: req.body.busy
    });
    
});

/* Send POST request to GET. */
router.post('/', addSlash, function(req, res, next) {
    if (!req.body.card) return res.send('No card data sent');
    return res.redirect('./' + (req.body.card.uuid || req.body.card)+'/');
});

// Get a set of cards
const baseQuery = [{setCode: 'KLD'}];
const parseVal = key => val => ({ [key]: isNaN(val) ? val : +val });
router.all('/explorer', addSlash, async function(req, res) {
  let query = [];
  if (req.body.filter) {
    const filter = JSON.parse(req.body.filter);
    for (const key in filter) {
      let entry = filter[key].and || [];
      if (filter[key].or && filter[key].or.length) {
        if (filter[key].or.length === 1) entry.push(filter[key].or[0]);
        else query.push({ $or: filter[key].or.map(parseVal(key))});
      }
      if (entry.length) query.push(...entry.map(parseVal(key)));
    }
  }
  else { query = baseQuery; }
  console.log(req.body.filter, query);
  if (!query.length) return res.status(400).send('No parameters sent');
  else if (query.length === 1) query = query[0];
  else query = { $and: query };
  console.log(query);

  const cardGroup = await Card.find(query).then(r=>r.map(c=>c.toObject()));;
  if (!cardGroup || !cardGroup.length) return res.send('No card data for: '+req.body.filter);
  const cardDataKeys = sortedKeys(Object.keys(cardGroup[0]),'card');
  let fixData = [];
  for (const card of cardGroup) {
    fixData.push(await fixDb.testSettings(card.uuid));
  }

  return res.render('dbExplorer', {
    title: 'Explorer - Query Result',
    cardGroup: cardGroup,
    cardDataKeys, fixData
  });
});


// ------- Card changes

// Edit DB - post {editSet: {key, value}}
router.post('/:uuid/db/set', formatFixValue, makeBusy, async function(req, res, next) {
  const setKeys = await fixDb.setMulti(Card, req.params.uuid, req.body.editSet, req.body.note || 'Set on card');
  return res.reply({setKeys});
});

// Clear DB Edit - post {key}
router.post('/:uuid/db/clear', makeBusy, async function(req, res, next) {
  await fixDb.clearSetting(req.body.key, req.params.uuid, Card.modelName);
  return res.reply({key: req.body.key, cleared: true});
});



module.exports = router;
