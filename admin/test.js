const updateDb = require('./updateDb');

// updateDb(1, 1, 0, 1, 0);

const Settings = require('../models/Settings');
const Set = require('../models/Set');

async function updateSetList() {
    const setList = await Set.getSetList();
    setList.forEach(set => set.enabled = true);
    console.log(setList.length);
    console.log(setList[0]);
    console.log(setList[20]);
    await Settings.set('setList',setList);
    const savedList = await Settings.get('setList');
    console.log(savedList.length);
    console.log(savedList[0]);
    console.log(savedList[20]);
}

// updateSetList();





async function settingsTester() {

    await Settings.getAll().then(r => console.log(r)); // Existing settings (or {})
    await Settings.delete('test').then(r => console.log(r)); // Existing value (or undefined)
    await Settings.set('test',420).then(r => console.log(r)); // true/false (did 'test' already exist?)
    await Settings.get('test').then(r => console.log(r)); // 420
    await Settings.getAll().then(r => console.log(r)); // Existing settings + {test: 420}
    
    await Settings.delete('testArr').then(r => console.log(r)); // Existing value (or undefined)
    await Settings.push('testArr',1).then(r => console.log(r)); // 0
    await Settings.get('testArr').then(r => console.log(r)); // [1]
    await Settings.push('testArr',2).then(r => console.log(r)); // 1 
    await Settings.get('testArr').then(r => console.log(r)); // [1,2]
    await Settings.push('testArr',3).then(r => console.log(r)); // 2
    await Settings.get('testArr').then(r => console.log(r)); // [1,2,3]
    
    await Settings.getIndex('testArr',1).then(r => console.log(r)); // 2 
    await Settings.getIndex('testArr',4).then(r => console.log(r)); // undefined
    await Settings.setIndex('testArr',2,69).then(r => console.log(r)); // 2
    await Settings.getIndex('testArr',2).then(r => console.log(r)); // 69
    await Settings.get('testArr').then(r => console.log(r)); // [1,2,69]

    await Settings.setIndex('testArr',6,69).then(r => console.log(r)); // 6 
    await Settings.getIndex('testArr',6).then(r => console.log(r)); // 69
    await Settings.get('testArr').then(r => console.log(r)); // [1,2,69,-,-,-,69]
    
    await Settings.setIndex('testArr2',3,'testnew').then(r => console.log(r)); // 3 
    await Settings.getIndex('testArr2',0).then(r => console.log(r)); // null
    await Settings.getIndex('testArr2',3).then(r => console.log(r)); // 'testnew'
    await Settings.get('testArr2').then(r => console.log(r)); // [-,-,-,'testnew']

    await Settings.get('testArr').then(r => console.log(r)); // [1,2,69,-,-,-,69]
    await Settings.pop('testArr',1).then(r => console.log(r)); // 2
    await Settings.getIndex('testArr',1).then(r => console.log(r)); // 69
    await Settings.get('testArr').then(r => console.log(r)); // [1,69,-,-,-,69]

    await Settings.getAll().then(r => console.log(r)); // Existing settings + {test:420,testArr:[1...],testArr2:[...]}
    await Settings.setMany({poop: 'is', fun: [3,2,1], party: ['on','garth']}).then(r => console.log(r)); // [t/f,t/f,t/f] (if key existed)
    await Settings.getAll().then(r => console.log(r)); // Existing settings + test settings + {poop,fun,party}
    await Settings.pop('fun',1).then(r => console.log(r)); // 2
    await Settings.get('fun').then(r => console.log(r)); // [3,1]
    await Settings.getIndex('party',1).then(r => console.log(r)); // 'garth'

    await Settings.getAll().then(r => console.log(r)); // Existing settings + all new settings
    await Settings.deleteList(['test','testArr','testArr2','poop','fun','party']).then(r => console.log(r)); // [values...]
    await Settings.getAll().then(r => console.log(r)); // Existing settings only (or {})
    /*
        {}
        undefined
        false
        420
        { test: 420 }
        undefined
        0
        [ 1 ]
        1
        [ 1, 2 ]
        2
        [ 1, 2, 3 ]
        2
        undefined
        2
        69
        [ 1, 2, 69 ]
        6
        69
        [
        1,    2,    69,
        null, null, null,
        69
        ]
        3
        null
        testnew
        [ null, null, null, 'testnew' ]
        [
        1,    2,    69,
        null, null, null,
        69
        ]
        2
        69
        [ 1, 69, null, null, null, 69 ]
        {
        test: 420,
        testArr: [ 1, 69, null, null, null, 69 ],
        testArr2: [ null, null, null, 'testnew' ]
        }
        [ false, false, false ]
        {
        test: 420,
        testArr: [ 1, 69, null, null, null, 69 ],
        testArr2: [ null, null, null, 'testnew' ],
        fun: [ 3, 2, 1 ],
        poop: 'is',
        party: [ 'on', 'garth' ]
        }
        2
        [ 3, 1 ]
        garth
        {
        test: 420,
        testArr: [ 1, 69, null, null, null, 69 ],
        testArr2: [ null, null, null, 'testnew' ],
        fun: [ 3, 1 ],
        poop: 'is',
        party: [ 'on', 'garth' ]
        }
        [
        420,
        [ 1, 69, null, null, null, 69 ],
        [ null, null, null, 'testnew' ],
        'is',
        [ 3, 1 ],
        [ 'on', 'garth' ]
        ]
        {}
    */
}