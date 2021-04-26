// Simple, generic utilies

// Modulo w/ non-negative result
const mod = (a,n) => (a % n + n) % n;

// Looping array retrival (After last element get first & vice-versa)
const loopArray = (arr, index) => arr[mod(index, arr.length)];

// Swap array elements
const swapArr = (i,j,arr) => { if (i != j) [arr[i], arr[j]] = [arr[j], arr[i]]; };

// Check that object has keys
const notEmpty = obj => obj && Object.keys(obj).length !== 0

// Array comparison
function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    return arr1.every( (value,index) => value == arr2[index] );
}

// Short string date
const dateMMDDYY = date =>
    ((date.getMonth() + 1) + '/').padStart(3, '0') +
    (date.getDate() + '/').padStart(3, '0') +
    date.getFullYear().toString().substr(2);

// Send a reply object
const reply = (res, data={}) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  }

// Convert text stream to array of lines
const splitLines = (buffer) => {
    if (!(buffer instanceof Buffer)) {
        console.error('Failed to read non-Buffer object as Buffer.')
        return buffer;
    }
    return buffer.toString().split(/(?:\r\n|\r|\n)/g);
}

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



// Convert Object w/ many keys to Object Array
// ex. {a:1,b:2,c:3} => [{a:1},{b:2},{c:3}]
function objToArray(kvSet, keyName='key', valueName='value') {
    let arr = [];
    for (const key in kvSet) {
        arr.push({ [keyName]: key, [valueName]: kvSet[key] });
    }
    return arr;
}
// Inverse of prior (skipErrors doesn't include items w/o key & value properties)
function objArrayToObj(objArray, keyName='key', valueName='value', skipErrors=true) {
    let obj = {};
    for(const elem of objArray) {
        // Ignore empty items
        if (!skipErrors && !notEmpty(elem)) continue;
        // Fail if key & value are not properties of any element
        if (!(keyName in elem) || !(valueName in elem)) {
            if (skipErrors) continue;
            return console.error('ObjArray: invalid key/value name: '+Object.keys(elem));
        }
        // Fail if keyname is duped (if skipErrors, will overwrite prior value)
        if (!skipErrors && keyName in obj) {
            return console.error('ObjArray: duplicate key: '+elem[keyName]);
        }
        obj[elem[keyName]] = elem[valueName]
    }
    return obj;
}






// Convert to/from Base64
const convert = {
    // encode mongo.ObjectID as B64
    objIdToB64: objId =>
        objId.toString('base64')
            .replace(/=+$/,'')
            .replace(/\+/g,'-')
            .replace(/\//g,'_'),
    // decode mongo.ObjectID from B64
    b64ToObjId: b64 => 
        Buffer.from(b64, 'base64').toString('hex'),
    
    // encode jsonObj as B64
    objToB64: obj =>
        Buffer.from(JSON.stringify(obj)).toString('base64')
            .replace(/=+$/,'')
            .replace(/\+/g,'-')
            .replace(/\//g,'_'),
    // decode jsonObj from B64
    b64ToObj: b64 =>
        JSON.parse(Buffer.from(b64,'base64').toString())
}



module.exports = {
    swapArr,
    mod,
    loopArray,
    arraysEqual,
    notEmpty,
    dateMMDDYY,
    reply,

    splitLines,
    filterObject,
    maxIndex,
    objToArray,
    objArrayToObj,

    convert
}