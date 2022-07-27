import express from 'express';
import {
  IController,
  IResult,
  IUser,
  IService,
  IRequest,
  IResponse,
} from '../interfaces';
import {validationMiddleware} from '../middlewares';
import {authenticationMiddlewware} from '../middlewares/authenticationMiddleware';

export class UserController implements IController<IUser> {
  private readonly _path: string;
  private readonly _router: express.Router;
  private readonly _service: IService<IUser>;

  constructor(service: IService<IUser>, path?: string) {
    this._path = path || 'user';
    this._service = service;
    this._router = express.Router();
  }

  initializeRoutes = () => {
    this._router
      .all(`${this._path}`, authenticationMiddlewware)

      /*
        @route  GET /api/user
        @desc   return a list of users
        @access private
      */
      .get(`${this._path}`, this.getAll)

      /*
        @route  GET /api/user/id
        @desc   returns a single user
        @access private
      */
      .get(`${this._path}/:id`, this.getOne)

      /*
        @route  POST /api/user
        @desc   creates a user
        @access private
      */
      .post(
        `${this._path}`,
        validationMiddleware({type: 'user'} as IUser),
        this.save
      )

      /*
        @route  PUT /api/user/id
        @desc   updates a single use record
        @access private
      */
      .put(
        `${this._path}/:id`,
        validationMiddleware({type: 'user'} as IUser),
        this.update
      )

      /*
        @route  DELETE /api/user/id
        @desc   deletes a single use record
        @access private
      */
      .delete(
        `${this._path}/:id`,
        validationMiddleware({type: 'user'} as IUser),
        this.delete
      );
  };

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  getAll = (req: IRequest, res: IResponse): Promise<IResponse> => {
    throw new Error('Not Implemented');
  };

  getOne = (req: IRequest, res: IResponse): Promise<IResponse> => {
    throw new Error('Not Implemented');
  };

  save = (req: IRequest, res: IResponse): Promise<IResponse> => {
    throw new Error('Not Implemented');
  };

  update = (req: IRequest, res: IResponse): Promise<IResponse> => {
    throw new Error('Not Implemented');
  };

  delete = (req: IRequest, res: IResponse): Promise<IResponse> => {
    throw new Error('Not Implemented');
  };
}
