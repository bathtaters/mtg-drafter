const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { cardDetailLayout, sortedKeys } = require('../../config/definitions');
const { addSlash } = require('../../controllers/shared/middleware');



/* GET cardDetail page. */
router.get('/:uuid', addSlash, async function(req, res, next) {  
    
    // Missing param
    if (!req.params.uuid) {
        console.error('cardDetail called w/o card.');
        res.redirect('../../');
    }

    // Lookup card data
    const cardData = await Card.findById(req.params.uuid).then(d => d && d.toObject());
    if (!cardData) res.send('No card data for: '+req.params.uuid);

    // Get sorted list of keys
    const cardDataKeys = sortedKeys(Object.keys(cardData),cardDetailLayout);

    return res.render('cardDetail', {
        title: cardData.printedName || cardData.name,
        cardDataKeys,
        cardData: cardData
    });
    
});

/* Send POST request to GET. */
router.post('/', addSlash, function(req, res, next) {
    if (!req.body.card) return res.send('No card data sent');
    return res.redirect('./' + (req.body.card.uuid || req.body.card)+'/');
});

module.exports = router;
