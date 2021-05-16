// Initialize when server starts up

const Draft = require("../models/Draft");
const Settings = require("../models/Settings");

async function initializeServer() {
    // Mark all players as disconnected
    await Draft.disconnectAll();

    // Reset busy flag
    await Settings.set('busy',false);

    // Log
    return console.log('All players were disconnected & busy flag reset.');
}

module.exports = initializeServer;

