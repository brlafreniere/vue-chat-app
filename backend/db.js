module.exports = function () {
    var pgp = require('pg-promise')();
    var db = pgp('postgres://vue_chat_app:vue_chat_app@localhost:5432/vue_chat_app');
    return db;
}
