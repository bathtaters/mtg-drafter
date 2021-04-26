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
    'sta','lesson', // ?? strixhaven
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
    
    'dfcCommonUncommon',
    'pcCsCommon', 'pcCommon', 'nonlessonCommon',
    'sfcCommon', 'nonconspiracyCommon', 'nondraftCommon',
    'nongainlandCommon', 'nonlandCommon', 'nonBasictypeCommon', 'common',
    
    'commonOrBasic', 'basicOrCommonLand',
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
