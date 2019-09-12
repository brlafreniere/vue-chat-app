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

    async delete(user_id) {
        try {
            await db.query(`DELETE FROM room_users WHERE user_id = $1`, [user_id]);
            await db.query(`DELETE FROM users WHERE id = $1;`, [user_id]);
        } catch (e) {
            console.trace(e.stack);
        }
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
    },

    async update_nickname(client_token, new_nickname, next) {
        try {
            var query_string = `
            UPDATE users
            SET nickname = $1
            WHERE client_token = $2;`;
            var result = await db.query(query_string, [new_nickname, client_token]);
            next(false);
        } catch (e) {
            next(true);
            console.trace(e.stack);
        }
    },

    async prune_unregistered_users() {
        // get all users older than 1 day
        var query_string = `
        SELECT *
        FROM users
        WHERE created_at <= NOW() - INTERVAL '1 DAY';`
        try {
            var result = await db.query(query_string)
            var users = result.rows;
            users.forEach((user) => {
                User.delete(user.id);
            });
        } catch (e) {
            console.trace(e.stack);
        }
    }
};

module.exports = User;
