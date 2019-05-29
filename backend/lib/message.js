Message = {
    async create (payload) {
        try {
            query_str = `
                    INSERT INTO messages (text, nickname, created_at, room_id)
                    VALUES ($1, $2, NOW(), $3)
                    RETURNING id, text, nickname, created_at`
            var result = await db.query(query_str, [payload.message, payload.nickname, payload.room_id]);
            var message = result.rows[0];
            return message;
        } catch (e) {
            console.trace(e);
        }
    },

    async all (room_id) {
        if (!room_id) { throw new Error("No room_id provided"); }
        try {
            var result = await db.query("SELECT * FROM messages WHERE room_id = $1;", [room_id]);
            return result.rows;
        } catch (e) {
            console.trace(e);
        }
    }
};

module.exports = Message;
