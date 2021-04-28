
const populatePacks = require('./populatePacks');

// Populate session data for admin panel
const sessionProjection = 'name players round packs hostId updatedAt';
const sessionListData = ({
  sessionId, name, players, status,
  round, updatedAt, hostId, url
}) => ({
  sessionId, name, status, round,
  hostId, url,
  playerCount: players.length,
  date: updatedAt.toLocaleDateString(),
  time: updatedAt.toLocaleTimeString()
});


// Populate player data for session page
const playerData = ({ players, hostId }) => Promise.all(players.map(async ({
    _id, name, position, connected, pick, cards,
    cookieId, isDrafting, opponent, packsHeld, updatedAt
  }) => {
    const main = await populatePacks.all(cards.main);
    const side = await populatePacks.all(cards.side);
    const countLands = board => cards.basicLands.reduce((sum,data) =>
      (!board || data._id.includes(board)) ? sum + data.count : sum,
    0);
    return {
      cookieId, name, position, connected,
      isHost: hostId.toString() == _id.toString(),
      isDrafting, pick, packsHeld,
      opponent: opponent ? { name: opponent.name, id: opponent.cookieId } : 0,
      lands: cards.basicLands,
      landCount: {main: countLands('main'), side: countLands('side')},
      deck: {main, side},
      date: updatedAt ? updatedAt.toLocaleDateString() +' '+ updatedAt.toLocaleTimeString() : 'No date'
    };
}));

module.exports = { sessionListData, playerData, sessionProjection };