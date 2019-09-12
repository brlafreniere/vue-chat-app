var assert = require('assert');

require('./setup');

var Message = require('../lib/message');
var Room = require('../lib/room');

var db = require('../lib/db');

describe('Message', () => {
    describe('#create()', () => {
        it('should create a message in the database', async () => {
            var default_room = await Room.get_default();
            assert(default_room.id);

            await db.query('TRUNCATE messages;');

            var result = await db.query("SELECT count(*) FROM messages;");
            count = result.rows[0].count
            assert(count == 0);

            var payload = {
                message: "foobar",
                nickname: "doctor_mccoy",
                room_id: default_room.id
            };
            await Message.create(payload);

            var result = await db.query("SELECT count(*) FROM messages;");
            count = result.rows[0].count;
            assert(count == 1);

            var result = await db.query("SELECT * FROM messages;");
            message = result.rows[0];
            assert(message.text == payload.message);
        });
    });

    describe('#all()', () => {
        it('should return a list of messages for a given room id', async () => {
            var default_room = await Room.get_default();

            await db.query('TRUNCATE messages;');

            var result = await db.query("SELECT count(*) FROM messages;");
            count = result.rows[0].count;
            assert(count == 0);

            await Message.create({
                message: 'Message #1',
                nickname: 'rando #423',
                room_id: default_room.id
            });

            await Message.create({
                message: 'Message #2',
                nickname: 'rando #23',
                room_id: default_room.id
            });

            await Message.create({
                message: 'Message #3',
                nickname: 'rando #403',
                room_id: default_room.id
            });

            var messages = await Message.all(default_room.id);
            assert(messages.length == 3);
        });
    });
});
