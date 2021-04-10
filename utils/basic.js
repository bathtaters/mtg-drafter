// Simple, generic utilies

// .filter() for Objects
function filterObject(obj, predicate) {
    let filtered = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && predicate(key, obj[key]))
            filtered[key] = obj[key];
    }
    return filtered;
}

// Get index of largest element in array
function maxIndex(arr) {
    let max = arr[0], index = 0;

    for (let i = 1, l = arr.length; i < l; i++) {
        if (arr[i] > max) {
            index = i; max = arr[i];
        }
    }

    return index;
}


// Convert text stream to array of lines
const splitLines = (buffer) => {
    if (!(buffer instanceof Buffer)) {
        console.error('Failed to read non-Buffer object as Buffer.')
        return buffer;
    }
    return buffer.toString().split(/(?:\r\n|\r|\n)/g);
}


// Modulo w/ non-negative result
const modulo = (a,n) => (a % n + n) % n;

// Looping array retrival (After last element get first & vice-versa)
const loopArray = (arr, index) => arr[modulo(index, arr.length)];

// Swap array elements
const swapArr = (i,j,arr) => { if (i != j) [arr[i], arr[j]] = [arr[j], arr[i]]; };

// Shuffles any array using Fisher-Yates
function shuffleArray(array) {
    let i = array.length;
    while (i--) {
      const j = random.int(i + 1);
      swapArr(i,j,array);
    }
    return array;
}

// Array comparison
function arraysEqual(arr1, arr2) {
    const len = arr1.length;
    if (len != arr2.length) return false;
    for (let i = 0; i < len; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}

// Convert Object w/ many keys to Object Array (Each key is an entry)
function objToArray(kvSet, keyName='key', valueName='value') {
    let arr = [];
    for (const key in kvSet) {
        arr.push({ [keyName]: key, [valueName]: kvSet[key] });
    }
    return arr;
}

// Check that object has keys
const notEmpty = obj => obj && Object.keys(obj).length !== 0


// Random operations
const randomAlgo = {
    selected: 'simple',
    // random algorithms
    simple: (max,min) => min + Math.floor(Math.random() * (max - min))
}
const random = {
    // chosen generator
    int: (maxExcl,minInclu=0) => randomAlgo[randomAlgo.selected](maxExcl,minInclu),
    // helper generators
    elem: array => array[random.int(array.length)],
    shuffle: array => {
        let i = array.length;
        while (i--) {
            const j = random.int(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

const sessionId = {
    // encode mongo.ObjectID as URL
    url: bytes =>
        bytes.toString('base64')
            .replace(/=+$/,'')
            .replace(/\+/g,'-')
            .replace(/\//g,'_'),
    // decode mongo.ObjectID from URL
    objId: url => 
        sessionId.btoh(url
            // should detect base64url
            // .replace(/-/g,'+')
            // .replace(/_/g,'/')
        ),
    
    // hex <=> base64 converter
    btoh: (b64) => Buffer.from(b64, 'base64').toString('hex'),
    htob: (hex) => Buffer.from(hex, 'hex').toString('base64')
}

const dataCompress = {
    objToB64: obj =>
        Buffer.from(JSON.stringify(obj)).toString('base64')
            .replace(/=+$/,'')
            .replace(/\+/g,'-')
            .replace(/\//g,'_'),
    b64ToObj: b64 =>
        JSON.parse(Buffer.from(b64,'base64').toString()) // should detect base64url
}


// Replate Brace code (used in db) w/ CSS styles (For mana.css)
function mtgSymbolReplace(text, shadow=false) {
    const tag = [
        '<i class="ms ms-cost' + (shadow ? ' ms-shadow' : '') + ' ms-',
        '"></i>'
    ];
    const specials = {
        'T': 'tap'
    };

    const replaceWith = (m, p1, o, s) => {
        let val = String(p1);
        if (val in specials) val = specials[val];
        val = val.replace(/\//g,'');
        val = val.toLowerCase();
        val = tag[0] + val + tag[1];
        //console.log('replaced: '+m+' with '+val);
        return val;
    }
    
    return text ? text.replaceAll(/\{(.{1,3})\}/g, replaceWith) : '';
}

const log = {
    player: player => console.log(' > player: '+player.name+' ['+player.position+'], connected? '+player.connected+', mainboard: '+player.cards.main.length+', sideboard: '+player.cards.side.length+', pick: '+player.pick+', packs: '+player.packsHeld+', currentPack: '+(player.currentPack || []).length),
    session: session => console.log(' > session state: '+session.status+', round: '+session.round+', players: '+session.players.length+', rounds: '+session.packs.length+', packs/round: '+session.packs.map(rnd => rnd.length)+', cards/pack: '+session.packs.map(rnd => rnd[0].length)),
    allPlayers: session => session.players.forEach(log.player),
    all: session => { log.session(session); log.allPlayers(session); }
}


module.exports = {
    sessionId: sessionId,
    random: random,
    splitLines: splitLines,
    shuffleArray: shuffleArray,
    swapArr: swapArr,
    mod: modulo,
    loopArray: loopArray,
    arraysEqual: arraysEqual,
    objToArray: objToArray,
    notEmpty: notEmpty,
    filterObject: filterObject,
    maxIndex: maxIndex,
    mtgSymbolReplace: mtgSymbolReplace,
    dataCompress: dataCompress,
    log: log
}

// ADD: swapArr, filterObject, arraysEqual, maxIndex