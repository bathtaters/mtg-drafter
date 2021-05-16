const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { editDisable, sortedKeys } = require('../../config/definitions');
const { addSlash, formatFixValue, makeBusy } = require('../../controllers/shared/middleware');
const fixDb = require('../../admin/fixDb');


/* GET cardDetail page. */
router.get('/:uuid', addSlash, async function(req, res, next) {  
    
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


// ------- Card changes

// Edit DB - post {editSet: {key, value}}
router.post('/:uuid/db/set', formatFixValue, makeBusy, async function(req, res, next) {
  const setKeys = await fixDb.setMulti(Card, req.params.uuid, req.body.editSet, req.body.note || 'Set from card detail');
  return res.reply({setKeys});
});

// Clear DB Edit - post {key}
router.post('/:uuid/db/clear', makeBusy, async function(req, res, next) {
  await fixDb.clearSetting(Card.modelName, req.params.uuid, req.body.key);
  return res.reply({key: req.body.uuid, cleared: true});
});



module.exports = router;
