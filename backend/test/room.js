var assert = require('assert');

require('./setup');

var Room = require('../lib/room');

describe('Room', () => {
    describe('#get_default()', () => {
        it('should get the default room from the database', async () => {
            var default_room = await Room.get_default();
            assert(default_room.name == Room.DEFAULT_ROOM_NAME);
        });
    })

    describe('#get()', () => {
        it('should get a room given an id', async () => {
            var default_room = await Room.get_default();
            var room_id = default_room.id;
            var room = await Room.get(room_id);
            assert(room.id = default_room.id);
            assert(room.name = default_room.name);
        });
    });
});
