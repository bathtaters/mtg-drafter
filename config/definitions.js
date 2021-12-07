// Definitions/Strings

// Default Draft Set
module.exports.defaultDraftSet = 'WAR'

// Default Draft Name
module.exports.defaultDraftName = 'New Draft'

// Basic lands
module.exports.basicLands = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'];

// Card Colors
module.exports.cardColors = ['W','U','B','R','G','other'];

// Order of booster pack cards (Not-included will be at start)
module.exports.boosterSortOrder = [
    'sta', // strixhaven
    'playtest', 'oldFrame', // Playtest set
    'dfc', 'therosGods', 'contraption', 'conspiracy', 'legendary', 'special',
    'mythicPartner1', 'nondraftRareMythic',

    'pcRare', 'modaldfcRareMythic', 'dfcRareMythic', 'legendaryRareMythic',
    'nonlessonRareMythic',
    'planeswalkerRareMythic','rareMythic', 'sfcRareMythic', 'nonlegendaryRareMythic',
    'nonplaneswalkerRareMythic', 'nonconspiracyRareMythic', 'rarePartner1',
    'rarePartner2', 'rarePartner3', 'rarePartner4', 'rarePartner5', 'rare',
    
    'pcCsUncommonRare',
    'pcUncommon', 'modaldfcUncommon', 'planeswalkerUncommon', 'legendaryUncommon',
    'uncommon', 'sfcUncommon', 'nonplaneswalkerUncommon', 'nonlegendaryUncommon',
    'nonconspiracyUncommon', 'nondraftUncommon', 'uncommonPartner1',
    'uncommonPartner2', 'uncommonPartner3', 'uncommonPartner4', 'uncommonPartner5',

    // Playtest set
    'multicolor','colorless',
    'whiteA','blueA','blackA','redA','greenA',
    'whiteB','blueB','blackB','redB','greenB',
    
    'dfcCommonUncommon',
    'pcCsCommon', 'pcCommon', 'nonlessonCommon',
    'sfcCommon', 'nonconspiracyCommon', 'nondraftCommon',
    'nongainlandCommon', 'nonlandCommon', 'nonBasictypeCommon', 'common',
    
    'lesson', 'commonOrBasic', 'basicOrCommonLand',
    'basicOrGainland', 'basictype', 'basic', 'land'
].reverse();

// Card group names
module.exports.groupTitles = { 'main': 'Mainboard', 'side': 'Sideboard' };

// Draft status enum
module.exports.draftStatus = {
    pre: 'unstarted',
    run: 'running',
    pause: 'paused',
    post: 'complete',
    isIn: function(status) {
        return status == this.run || status == this.pause;
    }
};

// Draft direction text
module.exports.directionText = {
    '1' : '<< << Passing << <<',
    '-1' : '>> >> Passing >> >>'
};

// Time format
module.exports.timeFormat = [ 'en-US', {
    hourCycle:'h23',
    month:'2-digit', day:'2-digit', year:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit'
}];

// Layout for cardDetail page (Admin side)
cardDetailLayout = {
    hide: ['_id','id','lineBrText','convertedManaCost','hasContentWarning'],
    unsortedAtEnd: true, // false = at start
    sort: [ // add 'br' for break
        'uuid','br','printedName','name','faceName','setCode','br',
        'type','types','rarity','side','br',
        'manaCost','cmc','br',
        'colors','bgdColor','monoColor','br',
        'text','footer','br','imgUrl',
        'multiverseId','gathererImg',
        'scryfallId','scryfallImg','scryfallImgBack',
        'noGath','skipArt','br',
        'otherFaceIds','variations','printings', 'br'
    ]
};

// Layout for setDetail page (Admin side)
setDetailLayout = {
    hide: ['name', 'sheets', 'boosters', 'boostersTotalWeight'],
    unsortedAtEnd: true, // false = at start
    sort: [ // add 'br' for break
        'code', 'releaseDate', 'br',
        'enabled', 'isDefault', 'br',
        'cardCount', 'gatherer', 'scryfall', 'br'
    ]
};

// Get sort keys for a given model
module.exports.sortedKeys = (keys,modelName) => {
    const layout = modelName.toLowerCase() == 'set' ? setDetailLayout :
        (modelName.toLowerCase() == 'card' ? cardDetailLayout : null);
    if (!layout) return console.error('Invalid layout model: '+modelName) || keys;

    let result = layout.sort;
    for (const key of keys) {
        if (layout.hide.includes(key) || result.includes(key))
            continue;
        
        if (layout.unsortedAtEnd) result.push(key);
        else result.unshift(key);
    }
    return result;
};

// Don't allow editing of these keys
module.exports.editDisable = {
    card: [
        'uuid','setCode','printedName','imgUrl','monoColor','bgdColor',
        'gathererImg','scryfallImg','scryfallImgBack'
    ],
    set: ['everything']
}