var assert = require('assert');

require('./setup');

var User = require('../lib/user');
var Room = require('../lib/room');

// describe('Array', function() {
// 	describe('#indexOf()', function() {
// 		it('should return -1 when the value is not present', function() {
// 			assert.equal([1, 2, 3].indexOf(4), -1);
// 		});
// 	});
// });

describe('User', () => {
    describe('#set_online_status()', () => {
        it('should set the online status to true', async () => {
            var default_room = await Room.get_default();
            var client_token = 'abcd';
            var user = await User.insert(client_token, 'foobar', default_room.id);

            // online_status should be falsy by default
            assert(!user.online_status);

            // set online_status to true
            await User.set_online_status(user.id, true);

            var user = await User.get(client_token);
            assert(user.online_status);
        });
    });

    describe('#insert_user()', () => {
        it('should insert a new user to the db and return a record', async () => {
            var default_room = await Room.get_default();
            var client_token = 'abcdefg';
            var nickname = 'foobarzle';

            var user = await User.insert(client_token, nickname, default_room.id);
            assert(user.nickname == nickname);
        });
    });

    describe('#get_user()', () => {
        it('should fetch a user from the database', async () => {
            var client_token = 'abcdefg123';
            var nickname = 'fargle';
            var default_room = await Room.get_default();
            var user = await User.insert(client_token, nickname, default_room.id);

            var user_id = user.id;

            var user = await User.get(client_token);
            assert(user.nickname == nickname);
        });
    });
});
