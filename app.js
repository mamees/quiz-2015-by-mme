var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var app = express();
var methodOverride = require('method-override');
var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session({secret:'yoursecret', cookie:{maxAge:120000}}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helper dinamicos
app.use(function(req, res, next) {
    // guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // hacer visible  req.session en las vistas
    res.locals.session = req.session;
    next();
});

// auto-logout
app.use(function(req, res, next) {
    if (req.session.user) {
        var now = new Date();
        var lastAccess = req.session.lastAccess;
        var minutes = 2;
        var seconds = 60;
        var milliseconds = 1000;
        var maxDate = new Date(lastAccess + minutes*seconds*milliseconds);

        if (now > maxDate) {
            delete req.session.user;
        } else {
            //   regenerar el ultimo acceso
            req.session.lastAccess = new Date().getTime();
        }
    }
  
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, 
        errors: []
    });
});


module.exports = app;
