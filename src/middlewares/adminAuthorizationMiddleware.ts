import {NextFunction} from 'express-serve-static-core';
import {ForbiddenException} from '../exceptions';
import {IRequest, IResponse} from '../interfaces';
import {Roles} from '../types';

export const adminAuthorizationMiddleware = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => {
  const role = req.user?.role;

  if (role === Roles.Admin) next();
  else next(new ForbiddenException());
};
