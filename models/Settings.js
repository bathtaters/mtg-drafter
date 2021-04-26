const { model, Schema } = require('mongoose');
const mtgDb = require('../config/db');


/* // Storage for arbitrary settings //
(returns Promise)
.get(settingName) = return settingValue
.getIndex(name,index) = return settingValue[index]
.getAll() = return allSettings as {_id: value, ...}

.set(name,value) = create/set name to value
.setIndex(name,index,value) = set index of name to value (creates new setting if needed)
.push(name,value) = append value to end of name
.pop(name,index) = removes index from name
.setMany({_id: value, ...}) = runs .set(_id,value) on entire object
.deleteMany([name,...]) = runs .delete(name) on list
*/


const settingsSchema = new mtgDb.Schema({
    _id: String,
    value: Schema.Types.Mixed
});



settingsSchema.static('get', async function(name){
    const setting = await this.findById(name);
    if (!setting) return;
    return setting.value;
});

settingsSchema.static('getIndex', async function(name,index){
    const arr = await this.get(name);
    return arr ? arr[index] : arr;
});

settingsSchema.static('getAll', async function(){
    let obj = {};
    const arr = await this.find({});
    arr.forEach( setting => obj[setting._id] = setting.value);
    return obj;
});



settingsSchema.static('set', async function(name,value){
    const setting = await this.findById(name);
    if (!setting) {
        return this.create({_id: name, value: value}).then(()=>false);
    }
    setting.value = value;
    setting.markModified('value');
    return setting.save().then(()=>true);
});

settingsSchema.static('delete', async function(name){
    const setting = await this.findById(name);
    if (!setting) { return; }
    const result = setting.value;
    return this.deleteOne({_id:setting._id}).then(()=>result);
});

settingsSchema.static('setIndex', async function(name,index,value){
    const setting = await this.findById(name);
    if (!setting) {
        let arr = []; arr[index] = value;
        return this.create({_id: name, value: arr}).then(()=>index);
    }
    if (index > setting.value.length) setting.markModified('value');
    setting.value[index] = value;
    setting.markModified('value.'+index);
    return setting.save().then(()=>index);
});

settingsSchema.static('push', async function(name,value,insert=-1){
    const setting = await this.findById(name);
    if (!setting) {
        return this.create({_id: name, value: [value]}).then(()=>0);
    }
    if (insert < 0) {
        insert = setting.value.length;
        setting.value.push(value);
    } else
        setting.value.splice(insert,0,value);
    setting.markModified('value');
    return setting.save().then(()=>insert);
});

settingsSchema.static('pop', async function(name,index){
    const setting = await this.findById(name);
    if (!setting) { return; }
    const result = setting.value[index];
    setting.value.splice(index,1);
    setting.markModified('value');
    return setting.save().then(()=>result);
});

settingsSchema.static('setMany', function(settingsObj){
    return Promise.all(Object.keys(settingsObj).map( setting =>
        this.set(setting, settingsObj[setting])
    ));
});

settingsSchema.static('deleteList', function(settingsList){
    return Promise.all(settingsList.map(name => this.delete(name)));
});


const Settings = model('Settings', settingsSchema);
module.exports = Settings;