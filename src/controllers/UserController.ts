import express, {Request, Response} from 'express';
import {IController, IResult, IUser, IService} from '../interfaces';
import {Model} from 'mongoose';

export class UserController implements IController<IUser> {
  private readonly _path: string;
  private readonly _router: express.Router;
  private readonly _service: IService<IUser>;
  private readonly _model: Model<IUser>;

  constructor(
    path: string = 'user',
    service: IService<IUser>,
    model: Model<IUser>
  ) {
    this._path = path;
    this._service = service;
    this._model = model;
    this._router = express.Router();
  }

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  getAll = (req: Request, res: Response): Promise<Response> => {
    throw new Error('Not Implemented');
  };

  getOne = (req: Request, res: Response): Promise<Response> => {
    throw new Error('Not Implemented');
  };

  save = (req: Request, res: Response): Promise<Response> => {
    throw new Error('Not Implemented');
  };

  update = (req: Request, res: Response): Promise<Response> => {
    throw new Error('Not Implemented');
  };

  delete = (req: Request, res: Response): Promise<Response> => {
    throw new Error('Not Implemented');
  };
}
