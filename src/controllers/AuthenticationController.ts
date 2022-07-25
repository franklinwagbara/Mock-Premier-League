import express, {Request, Response} from 'express';
import {IService, IUser} from '../interfaces';

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
    this._router.post(`${this._path}/register`, this.register);
  };

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    console.log(req.body);
    return res.status(200).send('result');
  };
}
