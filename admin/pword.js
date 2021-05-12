const Settings = require('../models/Settings');
const crypto = require('crypto');
const basicAuth = require('express-basic-auth');

const tableOps = {
    key: 'adminTable',
    encode: obj => Buffer.from(JSON.stringify(obj)).toString('base64'),
    decode: txt => JSON.parse(Buffer.from(txt, 'base64').toString('ascii')),
    read: async () => {
        const data = await Settings.get(tableOps.key);
        return data ? tableOps.decode(data) : undefined;
    },
    write: async obj => Settings.set(tableOps.key,tableOps.encode(obj)),
    reset: async () => tableOps.write({})
}
const pwOps = {
    set: pass => {
        const salt = crypto.randomBytes(32).toString('base64');
        return [salt,crypto.pbkdf2Sync(pass,salt,1080,64,'sha512').toString('base64')];
    },
    check: (pass, data) =>
        basicAuth.safeCompare(crypto.pbkdf2Sync(pass,data[0],1080,64,'sha512').toString('base64'),data[1])
}
async function setUser(uname, pword, oldPword) {
    if (!uname) return 'Username not provided';
    let users = await tableOps.read();
    if (uname in users) {
        if (!oldPword) return 'User already exists';
        else if (!pwOps.check(oldPword, users[uname])) return 'Incorrect password';
    } else if (!pword) { return 'Password not provided'; }
    users[uname] = pwOps.set(pword);
    return tableOps.write(users) ? 0 : 'Error updating user table';
}
async function changeUsername(uname, pword, newUname) {
    let users = await tableOps.read();
    if (!(uname in users)) return 'User doesn\'t exist';
    if (!pwOps.check(pword, users[uname])) return 'Incorrect password';
    if (newUname in users) return 'Username already exists'
    users[newUname] = users[uname];
    delete users[uname];
    return tableOps.write(users) ? 0 : 'Error updating user table';
}
async function removeUser(uname) {
    if (!uname) return 'Username not provided';
    let users = await tableOps.read();
    if (!(uname in users)) return 'User does not exists';
    delete users[uname]
    return tableOps.write(users) ? 0 : 'Error updating user table';
}
async function checkUser(uname, pword) {
    const users = await tableOps.read();
    const userList = Object.keys(users);
    const userInd = userList.map(u=>u.toLowerCase()).indexOf(uname.toLowerCase());
    if (userInd < 0) return false;
    return pword && pwOps.check(pword,users[userList[userInd]]);
}

module.exports = {
    deleteAll: () => tableOps.reset(),
    userList: () => tableOps.read().then(t=>Object.keys(t)),
    addUser: (uname, pword) => setUser(uname, pword, false),
    updateUser: setUser,
    authorizerAsync: (uname, pword, cb) => checkUser(uname, pword).then(valid => cb(null, valid)),
    changeUsername, removeUser
}