const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const basicAuth = require('express-basic-auth');

const tablePath = path.join(__dirname,'..','config','ut.bin');

const fileOps = {
    encode: obj => Buffer.from(JSON.stringify(obj)).toString('base64'),
    decode: txt => JSON.parse(Buffer.from(txt, 'base64').toString('ascii')),
    read: () => {
        let data;
        try { data = fs.readFileSync(tablePath).toString('ascii'); }
        catch (err) { console.error(err); return; }
        return data ? fileOps.decode(data) : undefined;
    },
    write: obj => {
        try { fs.writeFileSync(tablePath,fileOps.encode(obj)); }
        catch (err) { console.error(err); return false; } return true;
    },
    delete: () => fileOps.write({})
}
if (!fs.existsSync(tablePath))
    fileOps.delete() ?
        console.log('Created user table.') :
        console.log('Error creating user table.');
const pwOps = {
    set: pass => {
        const salt = crypto.randomBytes(32).toString('base64');
        return [salt,crypto.pbkdf2Sync(pass,salt,1080,64,'sha512').toString('base64')];
    },
    check: (pass, data) =>
        basicAuth.safeCompare(crypto.pbkdf2Sync(pass,data[0],1080,64,'sha512').toString('base64'),data[1])
}
function setUser(uname, pword, oldPword) {
    let users = fileOps.read();
    if ((uname in users) && !checkUser(uname,oldPword))
        return oldPword ? 'Incorrect password' : 'User already exists'
    users[uname] = pwOps.set(pword);
    return fileOps.write(users) ? 0 : 'Error updating user table'
}
function removeUser(uname) {
    let users = fileOps.read();
    if (!(uname in users)) return 'User does not exists';
    delete users[uname]
    return fileOps.write(users) ? 0 : 'Error updating user table'
}
function checkUser(uname, pword) {
    const users = fileOps.read();
    if (!(uname in users)) return false;
    return pword && pwOps.check(pword,users[uname]);
}

module.exports = {
    deleteAll: () => fileOps.delete(),
    userList: () => Object.keys(fileOps.read()),
    // addUser: (uname, pword) => setUser(uname, pword, false),
    // updateUser: setUser,
    authorizer: checkUser,
    removeUser
}