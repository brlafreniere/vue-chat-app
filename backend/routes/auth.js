var express = require('express');
var router = express.Router();
var passport = require('passport');

// auth_opts = { successRedirect: '/', failureRedirect: '/login', failureFlash: true };
// router.post('/login', passport.authenticate('local', auth_opts));

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) { return next(err); }
		if (!user) { return res.sendStatus(401); }
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.sendStatus(200);
		});
	})(req, res, next);
});

module.exports = router;
