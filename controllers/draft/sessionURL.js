/*
    Create session URL (Unique fixed-length base62 string, can be decoded to Date + Counter)
*/

// -- Settings -- //

// Width of URL
const fixedLength = 6;

// Maximum possible value of each of the below fields (NOTE: Every maxes[6] years, the year will repeat)
// MaxValue for [0:cntr, 1:sec, 2:min, 3:hr, 4:day, 5:mon, 6:year] (Actual counter max = 173)
const maxes   = [  170 ,   60 ,   60 ,   24,   31 ,   12 ,   10  ];
const indexed = [    0 ,    0 ,    0 ,    0,    1 ,    1 ,    0  ];
// ^ type of indexing of the above value (0-indexed or 1-indexed)



// -- Main functions -- //

// Reduce date to a single number
function toNumCode(date) {
    return ((((((
        (yearCode.enc(
          date.getUTCFullYear()) - indexed[6]) * maxes[5]
        + date.getUTCMonth()     - indexed[5]) * maxes[4]
        + date.getUTCDate()      - indexed[4]) * maxes[3]
        + date.getUTCHours()     - indexed[3]) * maxes[2]
        + date.getUTCMinutes()   - indexed[2]) * maxes[1]
        + date.getUTCSeconds()   - indexed[1]) * maxes[0]
        + counter.next()         - indexed[0]
    );
}

// Expand numCode to {date, counter}
function fromNumCode(num) {
    let date = [], counter;

    maxes.forEach( (max, i, maxArr) => {
        if (i) {
            num = Math.floor(num / maxArr[i - 1]);
            date.unshift((num % max) + indexed[i]);
        }
        // when i == 0, get the counter
        else counter = (num % max) + indexed[i];
    });

    // Convert yearCode to actual year
    date[0] = yearCode.dec(date[0]);
    return {date: new Date(Date.UTC(...date)), counter};
}



// -- Helpers -- //

// Get/Save counter value
// Ticks up each time next() is called then loops around once maxes[0] is reached
const counter = {
    n: -1,
    next: () => {
        counter.n = (counter.n + 1) % maxes[0];
        return counter.n;
    }
};

// Convert actual year to/from stored value
const yearCode = {
    enc: year => year % maxes[6],
    dec: encoded => {
        const yr = (new Date()).getUTCFullYear()
        const fc = maxes[6]; // Amount of time it takes a year to repeat
        return Math.floor(yr / fc) * fc + encoded
            - (yr % fc < encoded - 1 ? fc : 0); // Can be up to 1-year in the future (Due to timezones)
    }
};

// Base62 conversions
const base62 = {
    digits: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'],
    encode: int => {
        const base = base62.digits.length;
        let result = '';
        
        while (0 < int) {
            result = base62.digits[int % base] + result;
            int = Math.floor(int / base);
        }
        return result  || base62.digits[0];
    },
    decode: b62 => {
        const base = base62.digits.length; 
        let result = 0;
        
        [...b62].forEach( char => {
            result = result * base + base62.digits.indexOf(char);
        });
        return result;
    },
    offset: len => base62.decode(base62.digits[1] + base62.digits[0].repeat(len - 1)),
    encodeFixed: (int,len) => base62.encode(base62.offset(len) + int),
    decodeFixed: (b62) => base62.decode(b62) - base62.offset(b62.length)
}




// Combine base62 fixed encoding w/ date encoder
module.exports = {
    getURLCode: (date=null) => base62.encodeFixed(toNumCode(date || new Date()), fixedLength),
    decodeURL: url => fromNumCode(base62.decodeFixed(url)),
    width: fixedLength
}