db = require('./db');

User = {
    async set_online_status(user_id, status) {
        await db.query("UPDATE users SET online_status = $1 WHERE id = $2;", [status, user_id]);
    },

    async get(client_token) {
        try {
            var query_string = `
                SELECT *
                FROM users
                WHERE client_token = $1;`;
            var result = await db.query(query_string, [client_token]);
            var user = result.rows[0];
            if (user) { user.password = null; } // remove sensitive info
            return user;
        } catch (e) {
            console.trace(e.stack);
        }
    },

    // only return certain values so that sensitive info isn't carelessly
    // passed around
    async insert(client_token, nickname, primary_room_id) {
        var query_string = `
        INSERT INTO users (client_token, nickname, primary_room_id, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *;`
        var result = await db.query(query_string, [client_token, nickname, primary_room_id]);
        var user = result.rows[0];
        if (user) { user.password = null; }
        return user;
    },

    async list(room_id) {
        try {
            var query_string = `
            SELECT users.nickname, users.online_status
            FROM users 
            JOIN room_users ON (room_users.user_id = users.id)
            WHERE room_id = $1; `;
            var result = await db.query(query_string, [room_id]);
            var users_list = result.rows;
            return users_list;
        } catch (e) {
            console.trace(e.stack);
        }
    }
};

module.exports = User;
