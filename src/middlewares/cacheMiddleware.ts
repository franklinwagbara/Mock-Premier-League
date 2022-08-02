import {NextFunction} from 'express-serve-static-core';
import {HttpException} from '../exceptions';
import {IRequest, IResponse} from '../interfaces';
import {redisClient} from '../utils';
//import * as redis from 'redis';

export const cacheMiddleware = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => {
  // const redisClient = redis.createClient();

  // redisClient.on('error', err => console.log('Redis Client Error', err));
  // await redisClient.connect();

  redisClient
    .get(req.originalUrl)
    .then(cachedResult => {
      if (!cachedResult) return next();
      console.log('hit', cachedResult, req.originalUrl);
      return res.status(200).send(JSON.parse(cachedResult as string));
    })
    .catch(error => {
      console.log('catch miss', req.originalUrl);
      next(new HttpException(error, 500));
    });
};
