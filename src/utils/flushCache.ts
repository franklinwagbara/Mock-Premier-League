import redisClient from './redisClient';

export const flushCache = () => {
  redisClient.flushAll();
};
