var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./lib/db');

module.exports = function (app) {
	passport.use(new LocalStrategy(
		function(username, password, done) {
			db.query("SELECT * FROM users WHERE (nickname = $1 OR email_address = $1) AND password = $2;", [username, password])
				.then(user => {
					return done(null, user);
				})
				.catch(error => {
					if (error.name === 'QueryResultError') {
						return done();
					}
					return done(error);
				});
		}
	));

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	app.use(passport.initialize());
	app.use(passport.session());
}
