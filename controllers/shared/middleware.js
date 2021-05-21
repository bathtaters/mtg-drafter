const { cardColors } = require("../../config/definitions");
const Draft = require("../../models/Draft");
const Settings = require("../../models/Settings");
const { filterObject } = require("./basicUtils");
const logging = require("../../config/logging");
const validator = require("../../config/validator");


// --------------- Log requests
function logReq(req,res,next) {
  logging.log(logging.request(req)); next();
}




// --------------- Suffix / to URL if not already
function addSlash(req, res, next) {
  if (req.originalUrl.endsWith('/')) return next();
  if (/[^\.]+\.[^\.\/]+$/.test(req.originalUrl)) return next();

  console.log('Added slash: '+req.originalUrl+' => '+req.originalUrl + '/');
  
  if (req.method == "POST") return res.redirect(307, req.originalUrl + '/');
  return res.redirect(301, req.originalUrl + '/');
}


// --------------- Reply 'endware' that makes res.reply(data) reply w/ data (And {alert: {msg, redirect}} sends an alert)
function setupReply(req,res,next) {
  res.reply = (data = {}) => {
    res.replyData = data;
    return reply(req,res,next);
  };
  return next();
}
async function reply(req,res,next) {
  if (req.cancelBusy) { await Settings.set('busy', false); delete req.cancelBusy; }
  if (res.replyData === undefined) res.replyData = {error: 'Empty reply'};
  if (res.replyData.alert) return res.send( makeAlert(res.replyData.alert) );
  
  res.setHeader('Content-Type', 'application/json');
  return res.send(JSON.stringify(res.replyData));
}
// Create js alert() code
const makeAlert = (msg, redirect = null) => {
  if (Array.isArray(msg) && !redirect) [msg,redirect] = msg;
  let code = `<script>alert("${msg || ''}");`
  if (redirect) code += `window.location.replace("${redirect}");`
  code += '</script>'; return code;
}

// --------------- Include 'busy' flag
async function includeBusy(req, res, next) {
  req.body.busy = await Settings.get('busy').then(f=>f||false);
  return next();
}
async function makeBusy(req, res, next) {
  if (req.body.busy)
    return res.reply({error: 'Admin server is busy.'});

  await Settings.set('busy', true);
  req.body.busy = true; req.cancelBusy = true;
  return next();
}


// --------------- Create landCounts object from form values
const landKeys = ['main','side'].reduce( (acc,boardName) => 
  acc.concat(cardColors.filter(c => c.length == 1).map( color => 
    boardName + '-' + color.toLowerCase()
  )), []);
  
function landCounts(req, res, next) {
  req.body.landCount = filterObject(req.body, (k,v) => landKeys.includes(k));
  landKeys.forEach( k => delete req.body[k] );
  next();
}



// --------------- Import Session/Player from database and add to body data

const draftPathRe = new RegExp(`draft\\/(\\w{${validator.limits.sessionId.min}})(?:$|\\/)`)
// const draftPathRe = /draft\/([\w_-]{16})(?:$|\/)/;
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
  const session = await Draft.findById(sessionId);
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
const draftObjs = validator.cookieRules().concat(validator.validate, getDraftObjects);


// --------------- Import Session/Player for Session Detail and add to body data
async function sessionObjs(req, res, next) {

  // Get Session from URL -- Minus pack data
  req.body.session = await Draft.findById(req.params.sessionId,'-packs');
  if (!req.body.session) return res.reply({error: 'Session "'+req.params.sessionId+'" does not exist.'});

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
function formatFixValue(req,res,next) {
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
    setupReply, reply,
    includeBusy, makeBusy,
    landCounts, draftObjs,
    sessionObjs, formatFixValue
}