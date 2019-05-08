db2 = require('./db2');
User = require('./user');

async function send_general_room_info (socket) {
    try {
        var result = await db2.query("SELECT * FROM rooms WHERE name = 'general'");
        socket.emit('initial_room', result.rows[0]);
    } catch (e) {
        console.trace(e);
    }
}

function on_get_users_list (socket) {
    socket.on('get_users_list', async (payload, callback) => {
        try {
            var query_str = `
                SELECT users.nickname, users.online_status
                FROM room_users 
                JOIN users ON (room_users.user_id = users.id)
                WHERE room_id = $1`
            var result = await db2.query(query_str, [payload.room_id])
            callback(result.rows);
        } catch (e) {
            console.trace(e);
        }
    });
}

function on_load_room_messages(socket) {
    socket.on('load_room_messages', async (payload) => {
        try {
            var result = await db2.query("SELECT * FROM messages WHERE room_id = $1;", [payload.room_id]);
            socket.emit('load_messages', result.rows);
        } catch (e) {
            console.trace(e);
        }
    });
}

function on_create_message(socket, io) {
    socket.on('create_message', async (payload) => {
        try {
            query_str = `
            INSERT INTO messages (text, nickname, created_at, room_id)
            VALUES ($1, $2, NOW(), $3)
            RETURNING id, text, nickname, created_at`
            var result = await db2.query(query_str, [payload.message, payload.nickname, payload.room_id]);
            var message = result.rows[0];
            io.sockets.emit('new_message', message);
        } catch (e) {
            console.trace(e);
        }
    });
}

function set_user_status_to_online(client_string) {
    db2.query("UPDATE users SET online_status = true WHERE client_string = $1;", [client_string]);
}

function on_get_nickname(socket) {
    socket.on('get_nickname', async (client_string, callback) => {
        try {
            console.log(client_string);
            var result = await db2.query("SELECT * FROM users WHERE client_string = $1;", [client_string])
            user = result.rows[0];
            set_user_status_to_online(client_string);
            callback(user);
        } catch (e) {
            console.trace(e);
        }
    });
}

async function on_nickname_register(socket) {
    socket.on('nickname_register', async (payload) => {
        var { nickname, client_string } = payload;
        try {
            var result = await db2.query("SELECT * FROM users WHERE client_string = $1", [client_string]);
            user = result.rows[0];
            if (!user) {
                var query_str = "INSERT INTO users (nickname, client_string, created_at) VALUES ($1, $2, NOW()) RETURNING *;"
                var result = await db2.query(query_str, [nickname, client_string])
                user = result.rows[0];
                socket.emit('nickname_registered', user);
            } else {
                var result = await db2.query("UPDATE users SET nickname = $1;", [payload.nickname]);
                socket.emit('nickname_registered', user);
            }
        } catch (e) {
            console.trace(e);
        }
    });
}

function on_join_room(socket) {
    socket.on('join_room', async (payload, next) => {
        var { client_string, room_id } = payload;
        try {
            var result = await db2.query("SELECT * FROM users WHERE client_string = $1", [client_string]);
            var user = result.rows[0];
            if (user) {
                var result = await db2.query("SELECT * FROM room_users WHERE room_id = $1 AND user_id = $2;", [room_id, user.id]);
                var room_user = result.rows[0];
                if (!room_user) {
                    await db2.query("INSERT INTO room_users (room_id, user_id) VALUES ($1, $2);", [room_id, user.id])
                    next(true);
                } else {
                    next(false);
                }
            }
        } catch (e) {
            console.trace(e);
        }
    });
}

module.exports = function (io) {
    io.on('connection', (socket) => {
        send_general_room_info(socket);
        on_get_users_list(socket);
        on_load_room_messages(socket);

        socket.on('disconnect', () => {
            User.set_online_status();
        });

        on_join_room(socket);
        on_create_message(socket, io);
        on_get_nickname(socket);
        on_nickname_register(socket);
    });
}
