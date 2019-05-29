var ExpressSession = require('express-session');
var RedisStore = require('connect-redis')(ExpressSession);

var session = ExpressSession({
    resave: true,
    saveUninitialized: true,
    store: new RedisStore(),
    secret: process.env.SESSION_SECRET_KEY
});

module.exports = session;
