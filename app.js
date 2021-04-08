// uncomment to execute test on server start
//require('./admin/test');

// builtins
const path = require('path');
const createError = require('http-errors');

// main APIs
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const stylus = require('stylus');
const nib = require('nib');
const compression = require('compression');
const minify = require('express-minify');


// page routers
const indexRouter = require('./routes/index');
const draftRouter = require('./routes/draft');
const actionRouter = require('./routes/actions');
// const cardRouter = require('./routes/cardInfo');
// const packRouter = require('./routes/pack');
const myMw = require('./utils/middleware');


// stylesheet compile settings
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
  //uriDecodeFileNames: true,
  // debug: true,
  safeFileNames: true,
  fileSize: 1 * 1024 * 1024, // 1 MB file limit
  limitHandler: (req,res,next) =>
    res.send(JSON.stringify({error: 'File exceeds 1 MB'}))
}


// --- Build out Server ---

const app = express();

// pre-router middleware
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(stylus.middleware(stylusOptions));
//app.use(minify());
app.use(express.static(path.join(__dirname, 'public', 'icon')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload(uploadOptions));
app.use(express.json());
app.use(myMw.logReq);
app.use('/draft/:sessionId?',myMw.draftObjs);
app.use('/action',myMw.draftObjs);


// page router setup
app.use('/', indexRouter);
app.use('/draft', draftRouter);
app.use('/action', actionRouter);
// app.use('/card', cardRouter);
// app.use('/pack', packRouter);

// export modules to Pug
const { mtgSymbolReplace } = require('./utils/basic');
const populatePack = require('./utils/populatePacks');
const { draftStatus } = require('./config/definitions');
app.locals.symbFix = mtgSymbolReplace;
app.locals.popCards = populatePack;
app.locals.draftStatus = draftStatus;


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