// Update single elements of the database

const { arraysEqual } = require("../controllers/shared/basicUtils");
const Card = require("../models/Card");
const Set = require("../models/Set");
const Settings = require("../models/Settings");

// Local globals
const settingsKey = 'dbFixes'
const modelDict = { [Card.modelName]: Card, [Set.modelName]: Set };

// Private functions
const settingRegex = /([^[]+)\[([^\]]+)\]\.(.+)/
const settingString = setObj => `${setObj.model}[${setObj.id}].${setObj.key}`;
const settingObj = setStr => {
    const obj = setStr.match(settingRegex);
    if (!obj) return;
    return { model: obj[1], id: obj[2], key: obj[3] }
}
const same = (lhs, rhs) => lhs.model == rhs.model && lhs.id == rhs.id && lhs.key == rhs.key;

// Make update in DB
async function setDbFromObj(setting, toOriginal=false) {
    if (toOriginal ? setting.original === undefined : setting.value === undefined)
        return console.error('Cannot set '+settingString(setting)+' to '+(toOriginal ? 'original' : 'value')+' due to missing value.');

    const doc = await modelDict[setting.model].findById(setting.id);
    if (!doc) return console.error('Cannot set '+settingString(setting)+' to '+(toOriginal ? 'original' : 'value')+' due to bad id.');

    doc[setting.key] = toOriginal ? setting.original : setting.value;
    await doc.save(); return doc[setting.key];
}

// Check DB for setting
async function testDbSetting(setting) {
    const doc = await modelDict[setting.model].findById(setting.id).exec();
    if (doc[setting.key] === setting.value) return true;
    if (+doc[setting.key] === +setting.value) return true;
    return false;
}

// Update DB & Settings (UNDEFINED value will skip DB write (update note only))
async function setDb(Model, id, key, value=undefined, note='', forceOriginal=null) {
    // Update DB currently & save to Settings table
    const model = (typeof Model === 'string') ? Model : Model.modelName;
    if (!model) return console.error('Invalid Model, cannot setDb: ',{Model,id,key,value});
    
    const settings = await Settings.get(settingsKey);
    const index = settings ? settings.findIndex(s => same(s, {model,id,key})) : -2;

    let newSetting = { model, id, key, value, note };
    if (forceOriginal) newSetting.original = forceOriginal;
    else if (index >= 0 && settings[index].original) newSetting.original = settings[index].original; // Retain original value
    else newSetting.original = await Card.findById(id).then(c=>c[key]); // Get original value

    if (newSetting.value === undefined && index >= 0) newSetting.value = settings[index].value;

    // Only do DB update when VALUE is changed
    if (index < 0 || settings[index].value !== newSetting.value) {
        return Promise.all([
            setDbFromObj(newSetting), // UNCOMMENT TO ENABLE DB WRITES
            index < 0 ? Settings.push(settingsKey, newSetting) :
                Settings.setIndex(settingsKey, index, newSetting)
        ]);
    }
    return Settings.setIndex(settingsKey, index, newSetting);
}
async function setMulti(model, id, kvSet, note = '', ignoreUnchanged = true) {
    if (ignoreUnchanged) {
        const Model = (typeof model === 'string') ? modelDict[model] : model;
        if (!Model.modelName) return console.error('Invalid Model, cannot ignore setMultiDb: ',{model,id});
        const doc = await Model.findById(id).exec();
        if (!doc) return console.error('Invalid id, cannot ignore setMultiDb: ',{model,id});
        
        // Strip out already matching settings
        for (const key in kvSet) {
            if (doc[key] == kvSet[key]) delete kvSet[key];
            else if (Array.isArray(kvSet[key]) && arraysEqual(doc[key], kvSet[key])) delete kvSet[key];
        }
    }

    const modelName = (typeof model === 'string') ? model : model.modelName;
    if (!modelName) return console.error('Invalid Model, cannot setMultiDb: ',{model,id});
    for (const key in kvSet) {
        await setDb(modelName, id, key, kvSet[key], note);
    }
    
    return Object.keys(kvSet);
}
const changeNote = (note,key,id=null,model=Card.modelName) => {
    const q = id ? {model, id, key} : settingObj(key);
    return setDb(q.model, q.id, q.key, undefined, note).then(()=>q);
};

// Reset to original & update Settings
async function clearSettingObj(Model, id, key, ignoreOriginal = false) {
    const model = Model.modelName || Model;
    if (!model) return console.error('Invalid Model, cannot clearSetting: ',{Model,id,key});

    const settings = await Settings.get(settingsKey);
    const index = settings ? settings.findIndex(s => same(s, {model,id,key})) : -1;
    if (index < 0) return console.error('Cannot find setting to clear: ',{Model,id,key});

    if (!ignoreOriginal && settings[index].original) await setDbFromObj(settings[index], true);
    else if (!ignoreOriginal) console.error('No original value for: ',settings[index]);

    return Settings.pop(settingsKey, index);
}
async function clearSetting(key,id=null,model=Card.modelName,ignoreOriginal=false) {
    const q = id ? {model: model.modelName || model, id, key} : settingObj(key);
    return q ? clearSettingObj(q.model, q.id, q.key, ignoreOriginal) : console.error('Invalid setting to clear: '+key);
}
const clearAll = () => Settings.set(settingsKey, []);

// Move setting fwd (+) or back (-) in array
async function moveSetting(offset, key, id = null, model = Card.modelName) {
    const q = id ? {model: model.modelName || model, id, key} : settingObj(key);

    const settings = await Settings.get(settingsKey);
    const index = settings ? settings.findIndex(s => same(s, q)) : -1;
    if (index < 0) return console.error('Cannot find setting to clear: ',q);

    const newIndex = ((index + offset + 1) || 1) - 1; // Force -1 to be 0
    const setting = await Settings.pop(settingsKey, index);
    return Settings.push(settingsKey, setting, newIndex);
}

// Apply all saved settings from table
async function applySettings(revertToOriginal = false) {
    const settings = await Settings.get(settingsKey);
    if (!settings) return 0;
    for (const setting of settings) {
        await setDbFromObj(setting, revertToOriginal);
    }
    return settings.length;
}

// Get entire table as an array OR object
async function getSettings(asObject = false) {
    const settings = await Settings.get(settingsKey);
    if (!settings || !asObject) return settings;
    let result = {};
    settings.forEach(s => result[settingString(s)] = s );
    return result;
}
async function getSetting(key, id = null, model = Card.modelName) {
    const q = id ? {model: model.modelName || model, id, key} : settingObj(key);
    const settings = await Settings.get(settingsKey);
    return settings.find(s => same(q, s));
}

// Test which settings were applied (returns as object {settingString: true/false})
async function testSettings(forId = null) {
    let settings = await Settings.get(settingsKey);
    if (!settings) return settings;

    // Only match forId (doesn't check model==card.model)
    if (forId) settings = settings.filter(({id}) => id == forId);

    let result = {};
    for (const s of settings) {
        result[forId ? s.key : settingString(s)] = await testDbSetting(s);
    }
    return result;
}
const testAll = () => testSettings.then(res => Object.keys(res).every(key => 
    res[key]) ? 1 : (!Object.keys(res).every(key => !res[key]) ? 0 : -1 ) );

// Import from settings object (Overwrite/Ignore exisiting settings)
async function importSettings(settings, overwrite=true) {
    let existing;
    if (!overwrite) existing = await getSettings();
    const exists = setting => existing.findIndex(s => same(s, setting)) != -1;

    let r = 0, w = 0;
    for (const setting of settings) {
        r++;
        if (existing && exists(setting)) continue;
        await setDb(setting.model, setting.id, setting.key, setting.value, setting.note, setting.original);
        w++;
    }
    console.log('Imported '+w+'/'+r+' fixes.');
    return w;
}

module.exports = {
    setDb, setMulti, applySettings,
    clearSetting, clearAll,
    getSetting, getSettings,
    testSetting: testDbSetting,
    testSettings, testAll,
    moveSetting, changeNote,
    importSettings
}
