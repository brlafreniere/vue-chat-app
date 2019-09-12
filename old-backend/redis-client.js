redis = require("redis");

redis_client = redis.createClient();

redis_client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redis_client
