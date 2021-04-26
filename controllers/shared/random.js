// ------  All random-related operations ------ //
const { swapArr } = require('./basicUtils');
const crypto = require('crypto');

// ----- Algorithm options:
const allAlgorithms = {
  simple: (min,max) => min + Math.floor(Math.random() * (max - min)),
  secure: crypto.randomInt
};
// Selected algorithm
const randomAlgo = allAlgorithms.secure;


// ------ Public functions:

// Basic random operations
const int = (maxExcl,minInclu=0) => randomAlgo(minInclu,maxExcl);
const elem = array => array[int(array.length)];

// Shuffles any array using Fisher-Yates
function shuffle(array) {
    let i = array.length;
    while (i--) {
      const j = int(i + 1);
      swapArr(i,j,array);
    }
    return array;
}

module.exports = { int, elem, shuffle }