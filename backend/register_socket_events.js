db = require('./db')();
redis = require('./redis');

module.exports = function (io) {
    io.on('connection', (socket) => {

        // get all messages
		db.any('SELECT * FROM messages;').then( (data) => {
            socket.emit('load_messages', data);
	    });

        socket.on('create_message', (payload) => {
            // check if nickname is in use
            db.one('INSERT INTO messages(text, nickname) VALUES ($1, $2) RETURNING id, text, nickname', [payload.message, payload.nickname])
                .then(data => {
                    io.sockets.emit('new_message', data);
                })
                .catch(error => {
                    console.log('error: ', error);
                });
        });

        socket.on('get_nickname', (client_string, callback) => {
            redis.hget(client_string, "nickname", (error, reply) => {
                if (!error) {
                    callback(reply);
                } else {
                    callback(false);
                }
            })
        });

        socket.on('nickname_register', (payload, callback) => {
            redis.hset(payload.client_string, "nickname", payload.nickname, (error, reply) => {
                if (!error) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        })
    });
}
