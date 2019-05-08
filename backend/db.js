var environment = process.env.NODE_ENV;

if (!environment) {
    environment = 'development';
}

var database = '';

if (environment == 'development') {
    database = 'vue_chat_app_dev';
}

if (environment == 'production') {
    database = 'vue_chat_app';
}

var pgp = require('pg-promise')();
const connStr = 'postgres://' + database + ':' + database + '@localhost:5432/' + database;
var db = pgp(connStr);

module.exports = db;
