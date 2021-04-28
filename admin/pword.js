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
    let users = tableOps.read();
    if ((uname in users) && !checkUser(uname,oldPword))
        return oldPword ? 'Incorrect password' : 'User already exists'
    users[uname] = pwOps.set(pword);
    return tableOps.write(users) ? 0 : 'Error updating user table'
}
async function removeUser(uname) {
    let users = tableOps.read();
    if (!(uname in users)) return 'User does not exists';
    delete users[uname]
    return tableOps.write(users) ? 0 : 'Error updating user table'
}
async function checkUser(uname, pword) {
    const users = tableOps.read();
    if (!(uname in users)) return false;
    return pword && pwOps.check(pword,users[uname]);
}

module.exports = {
    deleteAll: () => tableOps.reset(),
    userList: () => tableOps.read().then(t=>Object.keys(t)),
    addUser: (uname, pword) => setUser(uname, pword, false),
    updateUser: setUser,
    authorizer: checkUser,
    removeUser
}