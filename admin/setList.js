const Settings = require('../models/Settings');
const Set = require('../models/Set');

const setListKey = 'setList'

function settingsSetList() { return Settings.get(setListKey); }
function filteredSetList() { return settingsSetList().then(list => list.filter(set => set.enabled)); }

async function resetSetList(allEnabled = true) {
    const setList = await Set.getSetList();
    setList.forEach(set => set.enabled = allEnabled);
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
        newSet.enabled = enableNew;
        await Settings.push(setListKey,newSet,insert);
        counter++;
    }
    return counter;
}

async function setVisibility(code, enabled = undefined) { // No value for enabled will toggle
    const setList = await settingsSetList();
    const index = setList.findIndex(set => code === set.code);
    if (index == -1) return console.error('Cannot find set: '+code);
    let newValue = setList[index];
    newValue.enabled = enabled === undefined ? !newValue.enabled : enabled;
    return Settings.setIndex(setListKey,index,newValue);
}

async function getVisibility(code) {
    const setList = await settingsSetList();
    const set = setList.find(set => code === set.code);
    if (!set) return console.error('Cannot find set: '+code);
    return set.enabled;
}

module.exports = {
    fullList: settingsSetList,
    visibleList: filteredSetList,
    resetSetList, updateSetList,
    setVisibility, getVisibility
}