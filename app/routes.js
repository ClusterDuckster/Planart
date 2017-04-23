// app/routes.js

//The holy AlphaCode
var trueAlphaCode = 'olliistderallerbeste';

//requires the game scheme
var Game = require('./models/game.js');

module.exports = function(app, passport, mongoose, io) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res, next){
			//if he got authenticated by remember me function send him to his profile
			if (req.isAuthenticated())
        		res.redirect('/profile');

    		// if they aren't carry on
    		return next();
		},function(req, res) {
        	// render the page and pass in any flash data if it exists
        	res.render('login.ejs', { message: req.flash('loginMessage') });
    });

	// process the login form
    app.post('/login',
		passport.authenticate('local-login', {
        	successRedirect : '/profile', // redirect to the secure profile section
        	failureRedirect : '/login', // redirect back to the signup page if there is an error
        	failureFlash : true // allow flash messages
    	}),
		//REMEMBER ME TOKEN
		function(req, res){
			// issue a remember me cookie if the option was checked
    		if (!req.body.remember_me) { return next(); }

    		var token = utils.generateToken(64);
    		Token.save(token, { userId: req.user.id }, function(err) {
      			if (err) { return done(err); }
      			res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      			return next();
    		});
		}
	);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', {
			  message: req.flash('signupMessage'),
			  emailMessage: req.flash('signupEmail'),
			  alphacodeMessage: req.flash('signupAlphacode')
		  });
    });

    // process the signup form
    app.post('/signup', checkSignUpInput, passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

	// =====================================
	// GAME LOUNGE  ========================
  // =====================================
	app.get('/game_lounge', isLoggedIn, function(req, res) {
    console.log('lounge: ' + req.user);
		res.render('lounge.ejs', {
			userID : JSON.stringify(req.user._id),
			username : JSON.stringify(req.user.local.username),
			userDefaultRoom : JSON.stringify(req.user.settings.defaultRoom),
      userChatColor : JSON.stringify(req.user.settings.chatColor)
		});
	});

  //Stay in lounge until game object is created, then redirect
  app.post('/game_lounge', createGame, function(req, res){
		io.sockets.emit('newGame', true, req.game);
		res.gameID = req.game._id;
		res.redirect('/game_lobby');
  });

	// =====================================
  // GAME LOBBY  =========================
  // =====================================
	app.get('/game_lobby', isLoggedIn, function(req, res) {
    console.log('into lobby, gameid: '+req.gameID);
		res.render('lobby.ejs', {
			userID : JSON.stringify(req.user._id),
			username : JSON.stringify(req.user.local.username),
      userDefaultRoom : JSON.stringify(req.user.settings.defaultRoom),
      userChatColor : JSON.stringify(req.user.settings.chatColor),
			gameID : JSON.stringify(req.gameID)
		});
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to create a game object and forward it to the game lobby
function createGame(req, res, next) {

  console.log('attempting to create game: ' + req.user);

  var newGame = new Game();

	newGame.name = JSON.stringify(req.user.local.username)+'s game';
  newGame.players.push({id: req.user._id, name: req.user.local.username});

  newGame.save(function(err) {
    if(err)
      throw err;

    req.game = newGame;

		console.log('created game');
    return next();
  });

  //return res.redirect('/game_lobby');

}

function checkSignUpInput(req, res, next){

	console.log(req.body.password);

	//Nothing fancy just checking for anything@anything.anything
	var emailtest = /\S+@\S+\.\S+/;

	//if AlphaCode is correct, carry on
	if(req.body.alphacode === trueAlphaCode && req.body.username !== "" && req.body.password !== "" && emailtest.test(req.body.email)){
		return next();
	} else {
		//If not, abort
		//Check which inputs are empty
		//And give back some lovely hand written flash messages
		if(req.body.username === "" && req.body.email === "" && req.body.password === "" && req.body.alphacode === ""){
			req.flash('signupMessage', 'You know, you have to type some stuff in here');
		} else if(req.body.username === "" && req.body.email === "" && req.body.password === "" && req.body.alphacode === trueAlphaCode){
			req.flash('signupMessage', 'Junge Junge Junge, Alphacode hat er, aber bekommt es nicht hin sein Zeug einzutragen ... peinlich');
		} else {
			// 3 Inputs empty
			if(req.body.email === "" && req.body.password === "" && req.body.alphacode === ""){
				req.flash('signupMessage', 'You also need to type in your email, desired password and the alphacode');
			} else if(req.body.username === "" && req.body.password === "" && req.body.alphacode === ""){
				req.flash('signupMessage', 'You need to specify a username, your desired password and the alphacode');
			} else if(req.body.email === "" && req.body.username === "" && req.body.alphacode === ""){
				req.flash('signupMessage', 'What am I supposed to do with only a password?');
			} else if(req.body.username === "" && req.body.email === "" && req.body.password === ""){
				req.flash('signupMessage', 'Secret AlphaCode is secret');
			} else {
				// 2 Inputs empty
				if(req.body.username === "" && req.body.email === ""){
					req.flash('signupMessage', 'So you are going with just password an alphacode? wtf')
				} else if(req.body.password === "" && req.body.email === ""){
					req.flash('signupMessage', 'Your security is precious to me, so I need an email and the password of your email... for maximum safety                        <- this is a joke, pls do not sue me')
				} else if(req.body.alphacode === "" && req.body.email === ""){
					req.flash('signupMessage', 'For safety reasons I need you to hand an email and alphacode over ........ jk I want to rip you off')
				} else if(req.body.username === "" && req.body.password === ""){
					req.flash('signupMessage', 'Username and password... that is pretty basic, get your shit together')
				} else if(req.body.username === "" && req.body.alphacode === ""){
					req.flash('signupMessage', 'Common, I need a username for you... and the alphacode of course')
				} else if(req.body.password === "" && req.body.alphacode === ""){
					req.flash('signupMessage', 'The secret secrets, give me.')
				} else {
					// 1 Input empty
					if(req.body.username == ""){
						req.flash('Choose your username, young Emperor');
					} else if(req.body.email == ""){
						req.flash('Email is required, I promise I will not do dirty stuff with it');
					} else if(req.body.password == ""){
						req.flash('No public accounts allowed, type in a password');
					} else if(req.body.alphacode == ""){
						req.flash('YOU ARE NOT WORTHY, LEAVE');
					}
				}
			}
		}
		//Check for false input and push additional flash messages
		//false email
		if(req.body.email !== "" && !emailtest.test(req.body.email)){
			req.flash('signupEmail', 'You might want to check your email');
		}
		//false alphacode
		if(req.body.alphacode !== "" && req.body.alphacode !== trueAlphaCode){
			req.flash('signupAlphacode', 'Wrong Alpha Code');
		}

	}


	res.redirect('/signup');
}
