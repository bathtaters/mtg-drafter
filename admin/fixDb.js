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

function setDbFromObj(setting, toOriginal=false) {
    return modelDict[setting.model].updateOne(
        {_id: setting.id},
        { $set: { [setting.key]: toOriginal ? setting.original : setting.value } }
    ).exec();
}

async function testDbSetting(setting) {
    const doc = await modelDict[setting.model].findById(setting.id).exec();
    if (doc[setting.key] === setting.value) return true;
    if (+doc[setting.key] === +setting.value) return true;
    return false;
}


async function setDb(Model, id, key, value, forceOriginal=null) {
    // Update DB currently & save to Settings table
    const model = (typeof Model === 'string') ? Model : Model.modelName;
    if (!model) return console.error('Invalid Model, cannot setDb: '+JSON.stringify({Model,id,key,value}));
    
    const settings = await Settings.get(settingsKey);
    const index = settings ? settings.findIndex(s => same(s, {model,id,key})) : -2;

    let newSetting = { model, id, key, value };
    if (index < 0) newSetting.original = await Card.findById(id).then(c=>c[key]); // Save original value
    if (forceOriginal) newSetting.original = forceOriginal;
    return Promise.all([
        setDbFromObj(newSetting), // UNCOMMENT TO ENABLE DB WRITES
        index < 0 ? Settings.push(settingsKey, newSetting) :
            Settings.setIndex(settingsKey, index, newSetting)
    ]);
}

async function clearSettingObj(Model, id, key) {
    const model = (typeof Model === 'string') ? Model : Model.modelName;
    if (!model) return console.error('Invalid Model, cannot clearSetting: '+JSON.stringify({Model,id,key}));

    const settings = await Settings.get(settingsKey);
    const index = settings ? settings.find( s => same(s, {model,id,key})) : -1;
    if (index < 0) return console.error('Cannot find setting to clear: '+JSON.stringify({Model,id,key}));

    if (settings.original) await setDbFromObj(settings, true);

    return Settings.pop(settingsKey, index);
}
async function clearSetting(key,id=null,model=Card.modelName) {
    const q = id ? {model: model.modelName || model, id, key} : settingObj(key);
    return clearSettingObj(q.model, q.id, q.key);
}
const clearAll = () => Settings.set(settingsKey, []);

async function setMulti(model, id, kvSet, ignoreUnchanged = true) {
    if (ignoreUnchanged) {
        const Model = (typeof model === 'string') ? modelDict[model] : model;
        if (!Model.modelName) return console.error('Invalid Model, cannot ignore setMultiDb: '+JSON.stringify({model,id}));
        const doc = await Model.findById(id).exec();
        if (!doc) return console.error('Invalid id, cannot ignore setMultiDb: '+JSON.stringify({model,id}));
        
        // Strip out already matching settings
        for (const key in kvSet) {
            if (doc[key] == kvSet[key]) delete kvSet[key];
            else if (Array.isArray(kvSet[key]) && arraysEqual(doc[key], kvSet[key])) delete kvSet[key];
        }
    }

    const modelName = (typeof model === 'string') ? model : model.modelName;
    if (!modelName) return console.error('Invalid Model, cannot setMultiDb: '+JSON.stringify({model,id}));
    for (const key in kvSet) {
        await setDb(modelName, id, key, kvSet[key]);
    }
    
    return Object.keys(kvSet);
}

async function applySettings(revertToOriginal = false) {
    // Apply all saved settings from table
    const settings = await Settings.get(settingsKey);
    if (!settings) return 0;
    for (const setting of settings) {
        await setDbFromObj(setting, revertToOriginal);
    }
    return settings.length;
}

async function getSettings(pretty=true) {
    // Get entire table as an object
    const settings = await Settings.get(settingsKey);
    if (!settings || !pretty) return settings;
    let result = {};
    settings.forEach(s => result[settingString(s)] = s.value );
    return result;
}
async function getSetting(key,id=null,model=Card.modelName) {
    const q = id ? {model: model.modelName || model, id, key} : settingObj(key);
    const settings = await Settings.get(settingsKey);
    return settings.find(s => same(q, s));
}

async function testSettings(forId=null) {
    // Test which settings were applied (returns as object)
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


async function importSettings(settings, overwrite=true) {
    let existing;
    if (!overwrite) existing = await getSettings(false);
    const exists = setting => existing.findIndex(s => same(s, setting)) != -1;

    let r = 0, w = 0;
    for (const setting of settings) {
        r++;
        if (existing && exists(setting)) continue;
        await setDb(setting.model, setting.id, setting.key, setting.value, setting.original);
        w++;
    }
    console.log('Imported '+w+'/'+r+' fixes.');
    return w;
}

module.exports = {
    setDb, setMulti, applySettings,
    clearSetting, clearAll,
    getSetting, getSettings,
    testSettings, testAll,
    importSettings
}
