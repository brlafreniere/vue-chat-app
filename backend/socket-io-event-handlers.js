db = require('./db')();
redis = require('./redis');

function send_general_room_info (socket) {
    db.one("SELECT * FROM rooms WHERE name = 'general'")
        .then(data => {
            socket.emit('initial_room', data);
        })
        .catch(error => {
            console.log(error);
        });
}

function on_get_users_list (socket) {
    socket.on('get_users_list', (payload, callback) => {
        db.any("SELECT * FROM room_users WHERE room_id = $1", [payload.room_id])
            .then(users => {
                callback(users);
            })
            .catch(error => {
                console.trace(error);
            });
    });
}

function on_load_room_messages(socket) {
    socket.on('load_room_messages', (payload) => {
        db.any("SELECT * FROM messages WHERE room_id = $1;", [payload.room_id])
            .then(data => {
                socket.emit('load_messages', data);
            })
            .catch(error => {
                console.trace(error);
            });
    });
}

function on_create_message(socket, io) {
    socket.on('create_message', (payload) => {
        // check if nickname is in use
        console.log(payload);
        db.one("INSERT INTO messages (text, nickname, created_at, room_id) VALUES ($1, $2, NOW(), $3) RETURNING id, text, nickname, created_at", [payload.message, payload.nickname, payload.room_id])
            .then(data => {
                io.sockets.emit('new_message', data);
            })
            .catch(error => {
                console.trace(error);
            });
    });
}

function on_get_nickname(socket) {
    socket.on('get_nickname', (client_string, callback) => {
        db.any("SELECT * FROM users WHERE client_string = $1;", [client_string])
            .then(user => {
                callback(user);
            })
            .catch(error => {
                console.trace(error);
            });
    });
}

function on_nickname_register(socket) {
    socket.on('nickname_register', (payload) => {
        db.one("SELECT * FROM users WHERE client_string = $1", [payload.client_string])
            .then(user => {
                if (user.length < 1) {
                    db.one("INSERT INTO users (nickname, client_string, created_at) VALUES ($1, $2, NOW()) RETURNING *;", [payload.nickname, payload.client_string])
                        .then(user => {
                            socket.emit('nickname_registered', user);
                        })
                        .catch(error => {
                            console.trace(error);
                        });
                } else {
                    db.one("UPDATE users SET nickname = $1;", [payload.nickname])
                        .then(user => {
                            socket.emit('nickname_registered', user);
                        })
                        .catch(error => {
                            console.trace(error);
                        });
                }
            })
            .catch(error => {
                console.trace(error)
            })
    })
}

function on_join_room(socket) {
    socket.on('join_room', (payload) => {
        db.one("SELECT * FROM users WHERE client_string = $1", [payload.client_string])
            .then(user => {
                db.none("INSERT INTO room_users (room_id, user_id) VALUES ($1, $2);", [payload.room_id, user.id])
                    .catch(error => {
                        console.trace(error);
                    });
            })
            .catch(error => {
                console.trace(error);
            });
    });
}

module.exports = function (io) {
    io.on('connection', (socket) => {
        send_general_room_info(socket);
        on_get_users_list(socket);
        on_load_room_messages(socket);

        socket.on('disconnect', () => {

        });

        on_join_room(socket);
        on_create_message(socket, io);
        on_get_nickname(socket);
        on_nickname_register(socket);
    });
}
