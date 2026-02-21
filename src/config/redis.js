const redis = require("redis");

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:6379`,
});

client.on("error", (err) => console.log("redis client error", err));
client.on("connect", () => console.log("redis connected"));

(async () => {
  await client.connect();
})();

module.exports = client;
