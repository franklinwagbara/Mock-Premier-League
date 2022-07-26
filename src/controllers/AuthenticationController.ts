import express from 'express';
import {NextFunction} from 'express-serve-static-core';
import {IRequest, IResponse, IService, IUser} from '../interfaces';
import {validationMiddleware} from '../middlewares';
import {validateRegister} from '../validations';

export class AuthenticationController {
  private readonly _path: string = '/auth';
  private readonly _router: express.Router;
  private readonly _service: IService<IUser>;

  constructor(service: IService<IUser>, path?: string) {
    this._path = path || this._path;
    this._router = express.Router();
    this._service = service;

    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this._router.post(
      `${this._path}/register`,
      validationMiddleware({type: 'register'} as unknown as IUser),
      this.register
    );
    this._router.post(
      `${this._path}/login`,
      validationMiddleware({type: 'user'} as IUser),
      this.login
    );
  };

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  register = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<IResponse> => {
    throw new Error('Unimplemented');
  };

  login = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<IResponse> => {
    console.log(req.body);
    return res.status(200).send('result');
  };
}
