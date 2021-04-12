const express = require('express');
///const setData = require('../../models/Set');
//const cardData = require('../../models/Card');
//const utils = require('../../controllers/basicUtils');
const router = express.Router();

//const { prettyPrintJson } = require('pretty-print-json');


/* GET home page. */
router.get('/:uuid', function(req, res, next) {  

    return res.redirect('../');
    
    if (!req.params.uuid) res.redirect('../');

    cardData.getCardData([req.params.uuid]).then( result => {
        if (!result.length) return res.redirect('../../');
        console.log(JSON.stringify(Object.keys(result[0])));

        const card = result[0];
        
        let htmlCard = {}
        for (const data in card) {
            htmlCard[data] = prettyPrintJson.toHtml(card[data]);
        }

        console.log(card.name + ": " + card.identifiers.multiverseId);

        return res.render('cardInfo', {
            title: card.name,
            image: card.imgUrl,
            cardData: card,
            html: htmlCard
        });
    })
    .catch(err => {
        console.log(err);
        res.send("Cannot find random card with UUID: '"+req.params.uuid+".'");
    });
    //
    
});
router.post('/', function(req, res, next) {
    console.log('cardinfo post: '+JSON.stringify(req.body));

    return res.redirect('../');

    // If from card being picked:
    if (req.body.button == "Pick Card") {
        console.log('fetching card data of picked card')
    } else {
        console.log("Getting random card from: "+req.body.setCode);
    }

    setData.getSetData(req.body.setCode)
    .then(set => {

        let card;
        if (req.body.button == "Pick Card") {
            card = cardData.getCardData([utils.draftId.uuid(req.body.draftId)],
                [],{},req.body.setCode).then( d => d[0]);
        } else {
            card = Promise.resolve(utils.randomElem(set.cards))
                .then(cardData.addExtraFields);
        }
        return card;
        
    }).then( card => {

        let htmlCard = {}
        for (const data in card) {
            htmlCard[data] = prettyPrintJson.toHtml(card[data]);
        }

        console.log(card.name + ": " + card.identifiers.multiverseId);

        return res.render('cardInfo', {
            title: card.name + ' (' + req.body.setCode + ')',
            image: card.imgUrl,
            cardData: card,
            html: htmlCard
        });
    })
    .catch(err => {
        console.log(err);
        res.send("Cannot find random card from set: '"+req.body.setcode+".'");
    });
});

module.exports = router;
