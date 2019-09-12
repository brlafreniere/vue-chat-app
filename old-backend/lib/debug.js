module.exports = function debug (msg) {
    if (process.env['DEBUG']) {
        console.debug(msg);
    }
}
