var express_session = require('express-session');
var RedisStore = require('connect-redis')(express_session);
var passport_socket_io = require("passport.socketio");
var cookie_parser = require('cookie-parser');

module.exports = function (io) {
    io.use(passport_socket_io.authorize({
        cookieParser: cookie_parser,       // the same middleware you registrer in express
        key:          'vue-chat-app.sid',       // the name of the cookie where express/connect stores its session_id
        secret:       process.env.SESSION_SECRET_KEY,    // the session_secret to parse the cookie
        store:        new RedisStore(),        // we NEED to use a sessionstore. no memorystore please
        success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));

    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');

        // The accept-callback still allows us to decide whether to
        // accept the connection or not.
        accept(null, true);

        // OR

        // If you use socket.io@1.X the callback looks different
        accept();
    }

    function onAuthorizeFail(data, message, error, accept){
        if(error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);

        // We use this callback to log all of our failed connections.
        accept(null, false);

        // OR

        // If you use socket.io@1.X the callback looks different
        // If you don't want to accept the connection
        if(error)
            accept(new Error(message));
        // this error will be sent to the user as a special error-package
        // see: http://socket.io/docs/client-api/#socket > error-object
    }
}
