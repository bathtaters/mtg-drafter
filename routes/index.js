var express = require('express');
var router = express.Router();

const Set = require('../models/Set');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const string = '';
  const setList = await Set.getSetList()
  return res.render('index', { title: 'Test Page', text: string, sets: setList });

  /*cubeData.getCardList(testCards)
    .then( data => console.log(data))
    .catch(err => console.log("ERROR: "+err));
  */
});

router.post('/', function(req, res, next) {
  //console.log(JSON.stringify(req.body));
  if(req.body.getType) {
    if(req.body.getType == 'Booster') return res.redirect(307, '/pack');
    if(req.body.getType == 'Card') return res.redirect(307, '/card');
  }
});


module.exports = router;
