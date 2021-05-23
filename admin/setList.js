const Settings = require('../models/Settings');
const Set = require('../models/Set');
const Card = require('../models/Card')

const setListKey = 'setList'

function settingsSetList() { return Settings.get(setListKey).then(l => l || []); }
function filteredSetList() { return settingsSetList().then(list => list.filter(set => set.enabled)); }

async function getCardInfo(setCode) {
    // Return info from card list
    const cards = await Card.find({setCode},'multiverseId noGath');

    let info = { cardCount: cards.length, gatherer: 0, scryfall: 0 };
    cards.forEach( card => {
        if (card.noGath || !card.multiverseId) info.scryfall++;
        else info.gatherer++;
    })
    // convert to percents
    // info.gatherer = 100 * info.gatherer / info.cardCount;
    // info.scryfall = 100 * info.scryfall / info.cardCount;
    return info;
}

async function appendSetData(setObj, enabled=true) {
    const cardInfo = await getCardInfo(setObj.code);
    setObj = {
        enabled, ...cardInfo, ...setObj
    };
    return setObj;
}

async function resetSetList(allEnabled = true) {
    const setList = await Set.getSetList();
    for (let i=0, e=setList.length; i < e; i++) {
        setList[i] = await appendSetData(setList[i], allEnabled);
    }
    await Settings.set(setListKey,setList);
    return setList.length;
}

async function updateSetList(enableNew = true) {
    const setListNew = await Set.getSetList();
    const setListOld = await settingsSetList();
    let counter = 0;
    for (let newSet of setListNew) {
        const index = setListOld.findIndex(oldSet => newSet.code === oldSet.code);
        if (index != -1) continue;
        const insert = setListOld.findIndex(oldSet => newSet.releaseDate > oldSet.releaseDate);
        newSet = await appendSetData(newSet, enableNew)
        await Settings.push(setListKey,newSet,insert);
        counter++;
    }
    return counter;
}

async function setVisibility(code, enabled = undefined) { // No value for enabled will toggle
    const setList = await settingsSetList();
    const index = setList.findIndex(set => code === set.code);
    if (index == -1) return console.error('Cannot find set: '+code) || index;
    let newValue = setList[index];
    newValue.enabled = enabled === undefined ? !newValue.enabled : enabled;
    return Settings.setIndex(setListKey,index,newValue);
}

// { getSetList(), enabled, cardCount, gatherer, scryfall }
async function getSetData(code) {
    const setList = await settingsSetList();
    const set = setList.find(set => code === set.code);
    if (!set) return console.error('Cannot find set: '+code);
    return set;
}

module.exports = {
    fullList: settingsSetList,
    visibleList: filteredSetList,
    resetSetList, updateSetList,
    setVisibility, getSetData
}