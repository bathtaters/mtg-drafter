// Initialize when server starts up

const Draft = require("../models/Draft");

// Mark all players as disconnected
Draft.disconnectAll().then(()=>console.log('All players were disconnected.'));
