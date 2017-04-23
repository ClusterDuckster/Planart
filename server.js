// source: https://scotch.io/tutorials/easy-node-authentication-setup-and-local
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var http 	 = require('http').Server(app);
var io 		 = require('socket.io')(http);
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
//set static folders to be used in html
app.use(express.static('public')); // files for client side use
app.use(express.static('node_modules/socket.io-client/dist')); // socket.io client module

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'Bei der Macht von Greyscull!' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.authenticate('remember-me'));

//Socket.io event on user connection
require('./config/socket.js')(io, mongoose);

// routes ======================================================================
require('./app/routes.js')(app, passport, mongoose, io); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
// app.listen(port);
http.listen(port, function(){
	console.log('Server listening on Port ' + port);
});

//FUNCTIONS
function find (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query).toArray(callback);
    });
}
