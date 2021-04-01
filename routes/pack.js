const express = require('express');
const router = express.Router();

const Draft = require('../models/Draft');
const populatePack = require('../utils/populatePacks');

/* Redirect to home page. */
router.get('/', function(req, res, next) {  
    res.redirect('../');
});

/* Get a pack. */
router.post('/',
  async function(req, res, next) {
    console.log('Request: '+ JSON.stringify(req.body));
    const setCode = req.body.setCode;

    // Clear prior draft data
    await Draft.deleteMany({});
    console.log('sessions database cleared.');

    // Generate a single pack from requested set
    const session = await Draft.newDraft({ playerCount: 1, packLayout: [setCode] }); 

    const cards = session.packs[0][0];//.map(c=>c.toObject());
    console.log("Rounds: " + session.packs.length + ", Packs: " +
      session.packs[0].length + ", Cards:" + cards.length);
    
    // Get relevant pack data
    const cardData = await populatePack(cards);

    // console.log(JSON.stringify(cardData[0]));
    // console.log(Object.keys(cardData[0]));
    // console.log(cardData[0].printedName);
    // console.log(cardData[0].lineBrText);
    // console.log(cardData[0].draftId);
    
    // Send page
    return res.render('pack', { title: setCode + " Pack", cardsInfo: cardData });
  }
);

module.exports = router;
