import {REDIS_SET_EXPIRATION_TIME} from './constants';
import redisClient from './redisClient';

export const cachedQuery = async (query: string, value: any) => {
  console.log('entering');
  await redisClient.setEx(
    query,
    REDIS_SET_EXPIRATION_TIME,
    JSON.stringify(value)
  );
  console.log('leaving');
};
