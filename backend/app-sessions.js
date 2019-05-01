var ExpressSession = require('express-session');
var RedisStore = require('connect-redis')(ExpressSession);


module.exports = function (app) {
    app.use(ExpressSession({
        store: new RedisStore(),
        secret: process.env.SESSION_SECRET_KEY
    }));
}
