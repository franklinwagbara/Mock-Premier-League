import {NextFunction} from 'express-serve-static-core';
import {
  AuthenticationTokenMissingException,
  InvalidAuthenticationTokenException,
} from '../exceptions';
import {IQuery, IRequest, IResponse, IUser} from '../interfaces';
import {ITokenData} from '../interfaces';
import {UserModel} from '../models';
import {MongoDbRepository} from '../repositories';
import {WebTokenService} from '../services';

export const authenticationMiddlewware = async (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => {
  const wts: WebTokenService = new WebTokenService();
  const token = req.cookies['access-token'];
  const repo = new MongoDbRepository(UserModel);

  if (!token) next(new AuthenticationTokenMissingException());

  try {
    const {data} = wts.verifyToken(token) as ITokenData<IUser>;

    const queryResult = await repo.getOne({email: data.email} as IQuery);

    if (queryResult.data) {
      req.user = queryResult.data as IUser;
      next();
    } else {
      next(new InvalidAuthenticationTokenException());
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
