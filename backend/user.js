db = require('./db');

User = {
    set_online_status(user_id, status) {
        db.none("UPDATE users SET online_status = $1 WHERE id = $2;", [status, user_id]);
    }
};

module.exports = User;
