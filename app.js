require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



// Routers
var reservationsRouter = require('./routes/reservations');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/diners');
var restaurantsRouter = require('./routes/restaurants');
var staffRouter = require('./routes/staff');
var dinersRouter = require('./routes/diners');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin_dashboard')));
app.use('/admin', express.static(path.join(__dirname, 'admin_dashboard', 'html')));
app.use(express.static(path.join(__dirname, 'diner_website')));
app.use(express.static(path.join(__dirname, 'diner_website', 'html')));


// API Routes
app.use('/api/reservations', reservationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/staff', staffRouter);
app.use('/api/diners', dinersRouter);
app.use('/', indexRouter);

// Error Handling
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error Page'
  });
});



module.exports = app;