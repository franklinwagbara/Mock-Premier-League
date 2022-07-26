import {NextFunction} from 'express-serve-static-core';
import {HttpException} from '../exceptions';
import {IRequest, IResponse} from '../interfaces';
import {Result} from '../types';

export const errorHandlingMiddleware = (
  exception: HttpException,
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => {
  res
    .status(exception.status)
    .send(new Result(null, null, exception.message, exception.status));
};
