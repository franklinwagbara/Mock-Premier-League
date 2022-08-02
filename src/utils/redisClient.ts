import * as redis from 'redis';

//const port = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient();

redisClient.on('error', err => console.log('Redis Client Error', err));

(async function () {
  await redisClient.connect();
})();
export default redisClient;
