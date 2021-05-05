const express = require('express');
const router = express.Router();

const Card = require('../../models/Card');
const { cardDetailLayout } = require('../../config/definitions');
const { addSlash } = require('../../controllers/shared/middleware');



/* GET cardInfo page. */
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
    let sortedKeys = cardDetailLayout.sort;
    for (const key in cardData) {
        if (cardDetailLayout.hide.includes(key) || sortedKeys.includes(key))
            continue;
        
        if (cardDetailLayout.unsortedAtEnd) sortedKeys.push(key);
        else sortedKeys.unshift(key);
    }

    return res.render('cardDetail', {
        title: cardData.printedName || cardData.name,
        cardDataKeys: sortedKeys,
        cardData: cardData
    });
    
});

/* Send POST request to GET. */
router.post('/', addSlash, function(req, res, next) {
    console.log('cardinfo post: '+JSON.stringify(req.body));

    if (!req.body.card) return res.send('No card data sent');

    return res.redirect('./' + (req.body.card.uuid || req.body.card));
});

module.exports = router;
