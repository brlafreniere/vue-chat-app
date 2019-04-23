db = require('./db')();

module.exports = function (io) {
    io.on('connection', (socket) => {

        // get all messages
		db.any('SELECT * FROM messages;').then( (data) => {
            socket.emit('load_messages', data);
	    });

        socket.on('create_message', (message) => {
            db.one('INSERT INTO messages(text) VALUES ($1) RETURNING id, text', [message])
                .then(data => {
                    io.sockets.emit('new_message', data);
                })
                .catch(error => {
                    console.log('error: ', error);
                });
        });
    });
}
