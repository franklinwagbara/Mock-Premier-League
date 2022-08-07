import express from 'express';
import {NextFunction} from 'express-serve-static-core';
import {IRequest, IResponse, IUser} from '../interfaces';
import {validationMiddleware} from '../middlewares';
import {UserModel} from '../models';
import {AuthenticationService} from '../services';
import {MongoDbRepository} from '../repositories';
import {Result} from '../types';
import {flushCache} from '../utils';

export class AuthenticationController {
  private readonly _path: string = '/auth';
  private readonly _router: express.Router;
  private readonly _authService: AuthenticationService;

  constructor(path?: string) {
    this._path = path || this._path;
    this._router = express.Router();
    this._authService = new AuthenticationService(
      new MongoDbRepository<IUser>(UserModel)
    );

    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this._router
      /*
        @route  POST /api/auth
        @desc   register a single user
        @access Public
      */
      .post(
        `${this._path}/register`,
        validationMiddleware({type: 'register'} as unknown as IUser),
        this.register
      )

      /*
        @route  POST /api/auth
        @desc   login a single user
        @access Public
      */
      .post(
        `${this._path}/login`,
        validationMiddleware({type: 'login'} as unknown as IUser),
        this.login
      )

      /*
        @route  POST /api/auth
        @desc   login a single user
        @access Public
      */
      .put(`${this._path}/logout`, this.logout);
  };

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  public createCookie = (
    res: IResponse,
    token: any,
    name?: string,
    days?: number
  ) => {
    return res.cookie(name || 'access-token', token, {
      expires: new Date(Date.now() + (days || 3) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  };

  register = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const {token, user} = await this._authService.register(req.body);
      this.createCookie(res, token, undefined, 3);

      //flush cache after update: simplistic implementation, can be improved with more time
      flushCache();

      return res.status(200).send(new Result({success: 'ok'}));
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };

  login = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const {token, user} = await this._authService.login(req.body);
      this.createCookie(res, token, undefined, 3);

      //flush cache after update: simplistic implementation, can be improved with more time
      flushCache();

      return res.status(200).send(new Result({success: 'ok'}));
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };

  logout = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      res.clearCookie('access-token');

      //flush cache after update: simplistic implementation, can be improved with more time
      flushCache();

      return res.status(200).send(new Result({success: 'ok'}));
    } catch (error) {
      console.error(error);
      return next(error);
    }
  };
}
