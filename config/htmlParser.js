// Special codes { 'BRACE CODE': 'mana.css code'  }
const specials = {
    'T': 'tap'
};

// Tag builder + Regex
const tagBuild = shadow => [
    '<i class="ms ms-cost' + (shadow ? ' ms-shadow' : '') + ' ms-',
    '"></i>'
];
const tagRegex = /<i class="ms ms-cost(?: ms-shadow)? ms-(.{1,3})"><\/i>/g;

// Brace builder + Regex
const braceBuild = ['{','}'];
const braceRegex = /\{(.{1,3})\}/g;

// Invert 'specials'
const invSpecials = {};
Object.keys(specials).forEach( key => invSpecials[specials[key]] = key);


// Replace Brace code (used in db) w/ CSS styles (For mana.css)
function mtgSymbolReplace(text, shadow=false) {
    const tags = tagBuild(shadow);
    const replaceWith = (m, p1, o, s) => {
        let val = String(p1);
        if (val in specials) val = specials[val];
        val = val.replace(/\//g,'');
        val = val.toLowerCase();
        val = tags[0] + val + tags[1];
        //console.log('replaced: '+m+' with '+val);
        return val;
    }
    return text ? text.replaceAll(braceRegex, replaceWith) : '';
}

// Inverse of SymbolReplace
function mtgSymbolRevert(text) {
    const replaceWithInv = (m, p1, o, s) => {
        let val = String(p1);
        if (val in invSpecials) val = invSpecials[val];
        val = val.toUpperCase();
        if (val.length == 2) val = val.charAt(0) + '/' + val.charAt(1);
        val = braceBuild[0] + val + braceBuild[1];
        //console.log('replaced: '+m+' with '+val);
        return val;
    }
    return text ? text.replaceAll(tagRegex, replaceWithInv) : '';
}

module.exports = { mtgSymbolReplace, mtgSymbolRevert }