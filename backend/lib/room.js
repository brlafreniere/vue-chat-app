db = require('./db');

Room = {
    DEFAULT_ROOM_NAME: 'general',

    async get_default() {
        try {
            var result = await db.query("SELECT * FROM rooms WHERE name = $1;", [Room.DEFAULT_ROOM_NAME]);
            default_room = result.rows[0];
            return default_room;
        } catch (e) {
            console.trace(e.stack);
        }
    },

    async get(id) {
        var query_string = `SELECT * FROM rooms WHERE id = $1;`;
        var result = await db.query(query_string, [id]);
        var room = result.rows[0];
        return room;
    },

    async join(user, room_id, next) {
        try {
            // find the room/user join record
            var query_string = `
                    SELECT * FROM room_users
                    WHERE room_id = $1 AND user_id = $2;
                    `
            var result = await db.query(query_string, [room_id, user.id]);
            var room_user = result.rows[0];
            // if no record exists, the user is not in the room
            // already... create the record (join the room)
            if (!room_user) {
                query_string = `
                        INSERT INTO room_users (room_id, user_id)
                        VALUES ($1, $2);
                        `
                await db.query(query_string, [room_id, user.id])
                send_users_list(socket, io);
            } else {
                // the user is already in the room
            }
            // store the room_id on the session object
            next();
        } catch (e) {
            console.trace(e);
        }
    }
}

module.exports = Room
