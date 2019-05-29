db = require('../db');
User = require('../user');
Room = require('../room');
Message = require('../message');

function set_user_status(client_token, status) {
    db.query("UPDATE users SET online_status = $1 WHERE client_token = $2;", [status, client_token]);
}

// this needs to send a refreshed users list to all clients!
// currently only sends the updated list to one client
async function send_users_list(socket, io) {
    var room_id = socket.handshake.session.current_room.id;
    var users_list = User.list(room_id);
    io.sockets.emit('refresh_users_list', users_list);
}

module.exports = function (io) {
    io.on('connection', async (socket) => {
        console.log(" ** connecting ** ");
        socket.on('disconnect', async () => {
            console.log(" ** disconnecting ** ");
            // no session info on disconnect...
            var client_token = socket.handshake.session.client_token;

            // need to wait until this finishes before sending user list
            await set_user_status(client_token, false);
            
            // at this point the client needs to become aware of the change in users list
            send_users_list(socket, io);
        });

        // set client token and current_user object
        socket.on('set_client_token', async (client_token, next) => {
            socket.handshake.session.client_token = client_token;
            next();
        });

        socket.on('set_current_user', (current_user) => {
            socket.handshake.session.current_user = current_user;
        });

        socket.on('get_current_user', async (next) => {
            try {
                var client_token = socket.handshake.session.client_token;
                current_user = await User.get(client_token);
                next(current_user);
            } catch (e) {
                console.trace(e.stack);
            }
        });

        socket.on('create_user', async (nickname, next) => {
            try {
                var client_token = socket.handshake.session.client_token;
                var default_room = await Room.get_default();
                await User.insert(client_token, nickname, default_room.id);
                var current_user = await User.get(client_token);
                next(current_user);
            } catch (e) {
                console.trace(e.stack);
            }
        });

        socket.on('set_online_status', async () => {
            var client_token = socket.handshake.session.client_token;
            console.log("Setting user's online status to true (client_token: " + client_token + ")");

            await set_user_status(client_token, true);
            send_users_list(socket, io);
        });

        socket.on('get_room', async (room_id, next) => {
            room = await Room.get(room_id);
            next(room);
        });

        socket.on('join_room', async (room_id, next) => {
            var current_user = socket.handshake.session.current_user;
            Room.join(current_user, room_id, next);

            var room = await Room.get(room_id);
            socket.handshake.session.current_room = room;
        });

        socket.on('load_room_messages', async (room_id) => {
            var messages = await Message.all(room_id);
            socket.emit('load_messages', messages);
        });


        socket.on('create_message', async (payload) => {
            var message = await Message.create(payload);
            io.sockets.emit('new_message', message);
        });

        socket.on('nickname_register', async (payload) => {
            var { nickname, client_string } = payload;
            try {
                var result = await db.query("SELECT * FROM users WHERE client_string = $1", [client_string]);
                user = result.rows[0];
                if (!user) {
                    var query_str = "INSERT INTO users (nickname, client_string, created_at) VALUES ($1, $2, NOW()) RETURNING *;"
                    var result = await db.query(query_str, [nickname, client_string])
                    user = result.rows[0];
                    socket.emit('nickname_registered', user);
                } else {
                    var result = await db.query("UPDATE users SET nickname = $1;", [payload.nickname]);
                    socket.emit('nickname_registered', user);
                }
            } catch (e) {
                console.trace(e);
            }
        });
    });
}
