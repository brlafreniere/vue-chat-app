// setup environment and stuff for testing

// Load env vars
console.log("Loading test environment variables...");
require('dotenv').config({path: __dirname + "/.env"});

// Drop and create tables
console.log("Dropping/creating database tables...");
const {execSync} = require('child_process');
let output = execSync('PGUSER=vue_chat_app_test PGPASSWORD=vue_chat_app_test psql < ./sql/create_tables.sql 2>&1 > /dev/null');
