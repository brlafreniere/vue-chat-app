redis_client = require("../../redis-client");
db = require('../db');
User = require('../user');
Room = require('../room');
Message = require('../message');

debug = require('../debug');

function set_user_status(client_token, status) {
    db.query("UPDATE users SET online_status = $1 WHERE client_token = $2;", [status, client_token]);
}

// this needs to send a refreshed users list to all clients!
// currently only sends the updated list to one client
async function send_users_list(socket, io) {
    var room_id = socket.handshake.session.current_room.id;
    var users_list = await User.list(room_id);
    io.sockets.emit('refresh_users_list', users_list);
}

module.exports = function (io) {
    io.on('connection', async (socket) => {
        debug(" ** connecting ** ");
        socket.on('disconnect', async () => {
            debug(" ** disconnecting ** ");

            // this comes up undefined when reconnecting/refreshing
            var user_id = socket.handshake.session.current_user.id;

            await User.set_online_status(user_id, false);
            send_users_list(socket, io);
        });

        socket.on('reconnect_attempt', () => {
            debug('reconnect');
        });

        // set client token and current_user object
        socket.on('set_client_token', async (client_token, next) => {
            console.log(socket.handshake.session);
            socket.handshake.session.client_token = client_token;
            console.log(socket.handshake.session);
        });

        socket.on('set_current_user', (current_user) => {
            socket.handshake.session.current_user = current_user;
        });

        socket.on('get_current_user', async (next) => {
            debug("Searching for user with client_token: " + client_token);
            current_user = await User.get(client_token);
            debug("Found user: " + current_user.nickname + " (ID: " + current_user.id + ")");
            next(current_user);
        });

        socket.on('create_user', async (nickname, next) => {
            var client_token = socket.handshake.session.client_token;
            var default_room = await Room.get_default();
            await User.insert(client_token, nickname, default_room.id);
            var current_user = await User.get(client_token);
            next(current_user);
        });

        socket.on('set_online_status', async () => {
            var current_user = socket.handshake.session.current_user;
            await User.set_online_status(current_user.id, true);
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

        socket.on('update_nickname', async (client_token, new_nickname, next) => {
            User.update_nickname(client_token, new_nickname, next);
        });
    });
}
