var ExpressSession = require('express-session');
var RedisStore = require('connect-redis')(ExpressSession);

var session = ExpressSession({
    resave: false,
    saveUninitialized: true,
    store: new RedisStore(),
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
        maxAge: 5 * 24 * 60 * 60 * 1000,
		secure: false
    },
    rolling: true
});

module.exports = session;
