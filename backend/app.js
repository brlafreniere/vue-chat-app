require('dotenv').config();

console.log("Environment: " + process.env.NODE_ENV );
console.log("Port: " + process.env.PORT);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth');

var app = express();

var flash = require('connect-flash');
var bodyParser = require('body-parser');

require('./app-sessions')(app);
require('./passport-config')(app);

app.use(flash());
app.use(bodyParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend')); // add this line
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://lizardgizzards.com:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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
