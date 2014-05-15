'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var memos = require('./routes/memos').memos;
var watch = require('./routes/watch').watch;
var rss = require('./routes/rss').rss;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());

// Log
log4js.configure(path.join(__dirname, 'log4js_setting.json'));
var loggerRequest = log4js.getLogger('request');
app.use(log4js.connectLogger(loggerRequest, { level: log4js.levels.INFO }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
} else {
  app.use(express.static(path.join(__dirname, '../client/app')));
}

app.get('/', routes.index);
app.use('/memos', memos);
app.use('/watch', watch);
app.use('/rss', rss);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.watch = watch;


module.exports = app;
