// uncomment to execute test.js on server start
require('./admin/test');


// main imports
const express = require('express');
const path = require('path');
const createError = require('http-errors');

// middleware
const basicAuth = require('express-basic-auth');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const stylus = require('stylus');
const nib = require('nib');
const compression = require('compression');
const minify = require('express-minify');
const adminPw = require('./admin/pword');
const myMw = require('./controllers/shared/middleware');

// page routers
const indexRouter = require('./routes/main/index');
const draftRouter = require('./routes/main/draft');
const actionRouter = require('./routes/main/actions');
const panelRouter = require('./routes/admin/panel');
const sessionDetailRouter = require('./routes/admin/session');




// Settings
const authOptions = {
  authorizer: adminPw.authorizer,
  challenge: true,
  unauthorizedResponse: 'This part of the site is restricted.'
}
const stylusOptions = {
  debug: true,
  src: path.join(__dirname, 'stylesheets'),
  dest: path.join(__dirname, 'public', 'stylesheets'),
  compile: (str,path) => 
    stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
      .import('nib')
};
const uploadOptions = {
  uriDecodeFileNames: true,
  // debug: true,
  safeFileNames: true,
  fileSize: 1 * 1024 * 1024, // 1 MB file limit
  limitHandler: (req,res,next) =>
    res.send(JSON.stringify({error: 'File exceeds 1 MB'}))
}
const viewDirs = [
  path.join(__dirname, 'views', 'admin'),
  path.join(__dirname, 'views', 'draft'),
  path.join(__dirname, 'views', 'generic')
];


// --- Build out Server ---

const app = express();

// pre-router middleware
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', viewDirs);
app.set('view engine', 'pug');
app.use(stylus.middleware(stylusOptions));
// app.use(minify());
app.use(express.static(path.join(__dirname, 'public', 'icon')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload(uploadOptions));
app.use(myMw.logReq);
app.use('/restricted/*',basicAuth(authOptions));
app.use('/action/lands',myMw.landCounts);
app.use('/draft/:sessionId?',myMw.draftObjs);
app.use('/action',myMw.draftObjs);


// page router setup
app.use('/', indexRouter);
app.use('/draft', draftRouter);
app.use('/action', actionRouter);
app.use('/restricted/panel', panelRouter);
app.use('/restricted/panel/session', sessionDetailRouter);

// export modules to Pug
app.locals.symbFix = require('./controllers/shared/htmlParser').mtgSymbolReplace;
app.locals.popCards = require('./controllers/shared/populatePacks');
app.locals.draftStatus = require('./config/definitions').draftStatus;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// Run initial setup
require('./config/init');