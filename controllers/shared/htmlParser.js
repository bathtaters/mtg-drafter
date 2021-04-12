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

module.exports = { mtgSymbolReplace }