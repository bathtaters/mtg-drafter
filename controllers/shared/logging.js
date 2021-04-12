const { notEmpty } = require("./basicUtils");


const player = playerObj =>
    ' > player: ' + playerObj.name + ' [' + playerObj.position +
    '], connected? ' + playerObj.connected + ', mainboard: ' + playerObj.cards.main.length +
    ', sideboard: ' + playerObj.cards.side.length + ', pick: ' + playerObj.pick +
    ', packs: ' + playerObj.packsHeld + ', currentPack: ' + (playerObj.currentPack || []).length;

const session = sessionObj => 
    ' > session state: ' + sessionObj.status + ', round: ' + sessionObj.round +
    ', players: ' + sessionObj.players.length + ', rounds: ' + sessionObj.packs.length +
    ', packs/round: ' + sessionObj.packs.map(rnd => rnd.length) +
    ', cards/pack: ' + sessionObj.packs.map(rnd => rnd[0].length);

const allPlayers = sessionObj => sessionObj.players.map(player).join('\n');

const fullSession = sessionObj => session(sessionObj) + '\n' + allPlayers(sessionObj);

const request = req => {
    let str = new Date().toISOString();
    if (notEmpty(req.params)) str += '; Parameters'+JSON.stringify(req.params);
    if (notEmpty(req.cookies)) str += '; Cookies'+JSON.stringify(req.cookies);
    if (notEmpty(req.body)) {
      const body = 'cubeData' in req.body && req.body.cubeData ? Object.assign({}, req.body, {cubeData: '...'}) : req.body;
      str += '; Posted'+JSON.stringify(body);
    }
    if (notEmpty(req.files)) str += '; Files'+JSON.stringify(Object.keys(req.files));
    str += '; IP: ' + (req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'N/A');
    return str
};

const log = (...args) => console.log(...args);
const debug = log;
const error = (...args) => console.error(...args);

module.exports = { 
    log, error, debug,
    request, fullSession, allPlayers, session, player
};