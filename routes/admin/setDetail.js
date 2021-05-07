const express = require('express');
const router = express.Router();

const Set = require('../../models/Set');
const Card = require('../../models/Card');
const Settings = require('../../models/Settings');
const setList = require('../../admin/setList');
const { setDetailLayout, sortedKeys } = require('../../config/definitions');
const { addSlash } = require('../../controllers/shared/middleware');



/* GET setDetail page. */
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
    const setDataKeys = sortedKeys(Object.keys(setData),setDetailLayout);
    
    return res.render('setDetail', {
      title: 'Admin Panel - '+req.params.setCode+' Detail',
      setData, setDataKeys
    });
});



/* GET Set/AllCards page. */
const cardDataObj = ({uuid, name, noGath, gathererImg}) => ({uuid, name, noGath, gathererImg}); 
router.get('/:setCode/all', addSlash, async function(req, res, next) {
    let setData = await Set.findById(req.params.setCode,'name');
    if (!setData) res.send(req.params.setCode+' set not found.');

    // Get all card names
    let cardData = await Card.find({setCode: req.params.setCode},'name noGath gathererImg');
    cardData = cardData.map(cardDataObj);

    return res.render('sheetDetail', {
        title: 'Admin Panel - '+req.params.setCode+':All Detail',
        set: { name: setData.name, code: setData.code },
        sheetData: { cards: cardData },
        sheetDataKeys: []
      });
});


/* GET Set/Sheet page. */
const sheetDataKeys = ['foil', 'balanceColors','totalWeight'];
router.get('/:setCode/:sheet', addSlash, async function(req, res, next) {
    let setData = await Set.findById(req.params.setCode,'name sheets');
    if (!setData) res.send(req.params.setCode+' set not found.');
    let sheetData = setData.sheets.find(sheet => sheet.name == req.params.sheet);
    if (!sheetData) res.send(req.params.setCode+':'+req.params.sheet+' sheet not found.');

    // Lookup card names
    sheetData = sheetData.toObject();
    sheetData.cards = await Promise.all(sheetData.cards.map(async card => {
        const cardData = await Card.findById(card.card,'name noGath gathererImg');
        return {...cardDataObj(cardData), uuid: card.card, weight: card.weight};
    }));

    return res.render('sheetDetail', {
        title: 'Admin Panel - '+req.params.setCode+':'+req.params.sheet+' Detail',
        set: { name: setData.name, code: setData.code },
        sheetData, sheetDataKeys
      });
});


/* Send POST request to GET. */
router.post('/', addSlash, function(req, res, next) {
    console.log('POSTED TO SET');
    if (!req.body.sets && !req.body.setCode) return res.send('No set data sent');
    if (Array.isArray(req.body.sets)) req.body.sets = req.body.sets[0];
    return res.redirect('./' + (req.body.setCode || req.body.sets) + '/');
});

module.exports = router;
