const { cardColors } = require("../../config/definitions");
const Draft = require("../../models/Draft");
const { reply, filterObject } = require("./basicUtils");
const logging = require("../../config/logging");
const validator = require("../../config/validator");


// --------------- Log requests
function logReq(req,res,next) {
  logging.log(logging.request(req)); next();
}




// --------------- Suffix / to URL if not already
const addSlash = (req, res, next) => {
  if (req.originalUrl.endsWith('/')) return next();
  if (/[^\.]+\.[^\.\/]+$/.test(req.originalUrl)) return next();

  console.log('Added slash: '+req.originalUrl+' => '+req.originalUrl + '/');
  
  if (req.method == "POST") return res.redirect(307, req.originalUrl + '/');
  return res.redirect(301, req.originalUrl + '/');
}




// --------------- Create landCounts object from form values
const landKeys = ['main','side'].reduce( (acc,boardName) => 
  acc.concat(cardColors.filter(c => c.length == 1).map( color => 
    boardName + '-' + color.toLowerCase()
  )), []);
  
function getLandCounts(req, res, next) {
  req.body.landCount = filterObject(req.body, (k,v) => landKeys.includes(k));
  landKeys.forEach( k => delete req.body[k] );
  next();
}



// --------------- Import Session/Player from database and add to body data
const draftPathRe = /draft\/([\w_-]{16})(?:$|\/)/;
async function getDraftObjects(req, res, next) {

  // URL is called from outside a session
  if (req.originalUrl == '/action/upload') return next();
  
  // Get session Id from URL or cookies
  const sessionUrl = req.originalUrl.match(draftPathRe);
  const sessionId = sessionUrl && sessionUrl[1] || req.cookies.sessionId;
  if (!sessionId) {
    logging.log('No sessionId provided.');
    return next();
  }

  // Load session from database
  const session = await Draft.findBySessionId(sessionId);
  if (!session) {
    logging.log('SessionId not found: '+sessionId);
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
  if (req.cookies.sessionId != session.sessionId) {
    res.cookie('sessionId', session.sessionId);
    res.clearCookie('playerId');
  }

  // Find player or assign to new spot
  const player = await session.addPlayer(req.cookies.playerId);
  if (!player) {
    logging.log('No such player: "'+req.cookies.playerId+'" & draft is full');
    return next();
  }
  returning = returning && player.cookieId == req.cookies.playerId;
  
  // Add playerData to request (& update cookie)
  req.body.player = player;
  if (!returning) { res.cookie('playerId', player.cookieId); }
  
  next();
}
const validatedDraftObjects = validator.cookieRules().concat(validator.validate, getDraftObjects);


// --------------- Import Session/Player for Session Detail and add to body data
async function getSessionObjects(req, res, next) {

  // Get Session from URL -- Minus pack data
  req.body.session = await Draft.findBySessionId(req.params.sessionId,'-packs');
  if (!req.body.session) return reply(res, {error: 'Session "'+req.params.sessionId+'" does not exist.'});

  // Get player from POST (disconnect) -- Only retrieve name/connected
  if (req.body.playerId) {
    req.body.player = await req.body.session.findPlayerByCookie(req.body.playerId, 'name connected');
  }

  // Get player from URL (DL deck) -- Only retrieve name/cards
  if (req.params.playerId) {
    req.body.player = await req.body.session.findPlayerByCookie(req.params.playerId,'name cards');
  }
  
  return next();
}


// --------------- Format 'Value' for Fixes
const fixesValueFormatter = (req,res,next) => {
  const fmtValue = value => {
    if (typeof value === 'string') {
      try { value = JSON.parse(value); }
      catch { value = value.toString(); }
    }
    if (Array.isArray(value)) {
      value = value.map(entry => 
        (typeof entry === 'string')
        ? entry.split(',').map( s => s.trim() ) // split based on ','
        : entry
      ).flat() // remove nesting
      .filter(e=>e); // remove blanks
    }
    return value;
  }

  if (req.body.value) req.body.value = fmtValue(req.body.value);
  if (req.body.editSet) {
    for (const key in req.body.editSet) {
      req.body.editSet[key] = fmtValue(req.body.editSet[key]);
    }
  }
  return next();
}


module.exports = {
    logReq, addSlash,
    landCounts: getLandCounts,
    draftObjs: validatedDraftObjects,
    sessionObjs: getSessionObjects,
    formatFixValue: fixesValueFormatter
}