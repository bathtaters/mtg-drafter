// uncomment to execute test on server start
//require('./admin/test');

// builtins
var path = require('path');
var createError = require('http-errors');

// main APIs
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var nib = require('nib');

// page routers
var indexRouter = require('./routes/index');
var draftRouter = require('./routes/draft');
var cardRouter = require('./routes/cardInfo');
var packRouter = require('./routes/pack');
var myMw = require('./utils/middleware');


// stylesheet compile settings
var stylusOptions = {
  src: path.join(__dirname, 'stylesheets'),
  dest: path.join(__dirname, 'public', 'stylesheets'),
  compile: (str,path) => 
    stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib())
      .import('nib')
};


// --- Start Server ---

var app = express();

// pre-router middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(stylus.middleware(stylusOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(myMw.logReq);
app.use('/draft/:sessionId?',myMw.draftObjs);

// page router setup
app.use('/', indexRouter);
app.use('/draft', draftRouter);
app.use('/card', cardRouter);
app.use('/pack', packRouter);

// export modules to Pug
var { mtgSymbolReplace } = require('./utils/basic');
var populatePack = require('./utils/populatePacks');
var { draftStatus } = require('./config/definitions');
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