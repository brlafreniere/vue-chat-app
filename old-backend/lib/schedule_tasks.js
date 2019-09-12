User = require('./user');
module.exports = function () {
    // setInterval(func, 5 * 60 * 1000);
    User.prune_unregistered_users();
}
