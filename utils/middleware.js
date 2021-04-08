const Draft = require("../models/Draft");
const basic = require("./basic");

// Quick log builders
function logReq(req,res,next) {
    let str = new Date().toISOString();
    if (basic.notEmpty(req.params)) str += '; Parameters'+JSON.stringify(req.params);
    if (basic.notEmpty(req.cookies)) str += '; Cookies'+JSON.stringify(req.cookies);
    if (basic.notEmpty(req.body)) {
      const body = 'cubeData' in req.body ? Object.assign({}, req.body, {cubeData: '...'}) : req.body;
      str += '; Posted'+JSON.stringify(body);
    }
    if (basic.notEmpty(req.files)) str += '; Files'+JSON.stringify(Object.keys(req.files));
    if (req.ip) str += '; From' + req.ip;
    console.log(str); next();
}

// Import Session/Player from database and add to header
const draftPathRe = /draft\/([\w_-]{16})(?:$|\/)/;
async function getDraftObjects(req, res, next) {

  // URL is called from outside a session
  if (req.originalUrl == '/action/upload') return next();
  
  // Get session Id from URL or cookies
  const sessionUrl = req.originalUrl.match(draftPathRe);
  const sessionId = sessionUrl && sessionUrl[1] || req.cookies.sessionId;
  if (!sessionId) {
    console.log('No sessionId provided.');
    return next();
  }

  // Load session from database
  const session = await Draft.findBySessionId(sessionId);
  if (!session) {
    console.log('SessionId not found: '+sessionId);
    return next();
  }
  let returning = session.sessionId == sessionId;

  // Append to URL if not already
  if (req.originalUrl.indexOf('draft') != -1 &&
    req.originalUrl.indexOf(session.sessionId) == -1) {
      return res.redirect(req.originalUrl.replace(/draft/,'draft/'+session.sessionId));
  }

  // Add sessionData to request (& update cookie)
  req.body.session = session;
  if (req.cookies.sessionId != session.sessionId)
    res.cookie('sessionId', session.sessionId);

  // Find player or assign to new spot
  const player = await session.addPlayer(req.cookies.playerId);
  if (!player) {
    console.log('No such player: "'+req.cookies.playerId+'" & draft is full');
    return next();
  }
  returning = returning && player.cookieId == req.cookies.playerId;
  
  // Add playerData to request (& update cookie)
  req.body.player = player;
  if (!returning) { res.cookie('playerId', player.cookieId); }
  
  return next();
}


module.exports = {
    logReq: logReq,
    draftObjs: getDraftObjects
}