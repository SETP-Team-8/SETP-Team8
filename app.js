require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//routers
var reservationsRouter = require('./routes/reservations');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/diners');
var restaurantsRouter = require('./routes/restaurants');
var staffRouter = require('./routes/staff');
var dinersRouter = require('./routes/diners');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'diner_website')));
app.use(express.static(path.join(__dirname, 'diner_website', 'html')));
app.use(cors());

// API routes
app.use('/api/reservations', reservationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/staff', staffRouter);
app.use('/api/diners', dinersRouter);

app.use('/', indexRouter); // This can remain without the API prefix if it serves HTML or static content

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
  console.error("Error status:", err.status);
  console.error("Error message:", err.message);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
    title: 'Error Page' // default title for the error page
  });
});

module.exports = app;