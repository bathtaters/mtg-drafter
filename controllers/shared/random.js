// ------  All random-related operations ------ //
const { swapArr } = require("./basicUtils");

// ----- Algorithm options:
const allAlgorithms = {
    simple: (max,min) => min + Math.floor(Math.random() * (max - min))
};
// Selected algorithm
const randomAlgo = allAlgorithms.simple;


// ------ Public functions:

// Basic random operations
const int = (maxExcl,minInclu=0) => randomAlgo(maxExcl,minInclu);
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