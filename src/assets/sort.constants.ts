import type { BoardLands } from 'types/game'

export const colorOrder = ['w','u','b','r','g'] as Array<keyof BoardLands>,

  rarityOrder = ["bonus","special","mythic","rare","uncommon","common","none"],

  typeOrder = [
    "Creature", "Summon", "Planeswalker",
    "Instant", "Sorcery", "Artifact", "Enchantment", "Land",
    "Conspiracy", "Dungeon", "Emblem", "Phenomenon", "Plane", "Scheme", "Vanguard", "Token",
  ],

  landNames = {
    w: 'Plains',
    u: 'Island',
    b: 'Swamp',
    r: 'Mountain',
    g: 'Forest',
  },

  boosterSortOrder = [
    // Foils
    'foilOrMasterpiece1In144', 'foilOrMasterpiece1In129', 
    'dedicatedFoil', 'dedicatedFoilDoubleMasters', 'unhingedFoil',
    'conspiracyFoil', 'contraptionFoil', 'tsFoil',
    'draftFoil', 'nondraftFoil', 'foil', 
    'foilMythicPartner1', 'foilRarePartner1', 'foilRarePartner2', 'foilRarePartner3', 'foilRarePartner4', 'foilRarePartner5',
    'foilRare', 
    'foilUncommonPartner1', 'foilUncommonPartner2', 'foilUncommonPartner3', 'foilUncommonPartner4', 'foilUncommonPartner5',
    'foilUncommon', 
    'foilCommon', 'foilCommonOrBasic', 'basicFoil', 'foilBasic',

    // Special cards
    'a30Retro', 'brrRetroArtifact', 'mechBasic', 'dedicatedFoilDoubleMasters', 
    'sunfSticker', 'sta', 'playtest', 'playtest2',
    'dfc', 'therosGods', 'contraption', 'conspiracy', 'draft',
    'legendary', 'background', 'tsts', 'special',

    // Mythics/Rares
    'mythicPartner1', 'nondraftRareMythic',
    'modaldfcRareMythic', 'dfcRareMythic', 
    'midDfcRareMythic', 'vowDfcRareMythic', 'legendaryRareMythic',
    'planeswalkerRareMythic', 'rareMythic', 'normalRareMythic',
    'sfcRareMythic', 'nonlegendaryRareMythic',
    'midSfcRareMythic', 'vowSfcRareMythic', 'nonlessonRareMythic',
    'nonplaneswalkerRareMythic', 'nonconspiracyRareMythic',
    
    'a30Rare', 'pcRare', 'rare',
    'rarePartner1', 'rarePartner2', 'rarePartner3', 'rarePartner4', 'rarePartner5',
    
    // Playtest set
    'oldFrame','colorless','multicolor','greenB','greenA',
    'redB','redA','blackB','blackA','blueB','blueA','whiteB','whiteA',

    'pcCsUncommonRare', 'newToModern',

    // Uncommons
    'pcUncommon', 'modaldfcUncommon', 'planeswalkerUncommon', 'legendaryUncommon',
    'midDfcUncommon', 'vowDfcUncommon', 'a30Uncommon',
    'uncommon', 'normalUncommon', 'sfcUncommon',
    'nonplaneswalkerUncommon', 'nonlegendaryUncommon',
    'midSfcUncommon', 'vowSfcUncommon',
    'nonconspiracyUncommon', 'nondraftUncommon',
    'uncommonPartner1', 'uncommonPartner2', 'uncommonPartner3', 'uncommonPartner4', 'uncommonPartner5',
    
    'dfcCommonUncommon',
    
    // Commons
    'midDfcCommon', 'vowDfcCommon',
    'pcCsCommon', 'pcCommon', 'nonlessonCommon',
    'sfcCommon', 'midSfcCommon', 'vowSfcCommon', 'a30Common',
    'nonconspiracyCommon', 'nondraftCommon', 'nonlegendaryCommon',
    'nongainlandCommon', 'nonlandCommon', 'nonBasictypeCommon', 'common',
    
    // Lands
    'lesson', 'commonOrBasic', 'basicOrCommonLand', 'a30Basic', 'a30RetroBasic',
    'sncBasic', 'basicOrGainland', 'basictype', 'basic', 'land'
  ]