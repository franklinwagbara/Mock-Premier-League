import express from 'express';
import {
  IController,
  IResult,
  IService,
  IRequest,
  IResponse,
  IQuery,
  IUser,
} from '../interfaces';
import {validationMiddleware} from '../middlewares';
import {authenticationMiddlewware} from '../middlewares/authenticationMiddleware';
import _ from 'lodash';
import {NextFunction, Query} from 'express-serve-static-core';
import {
  AlreadyExistException,
  DoesNotExistException,
  HttpException,
} from '../exceptions';
import {Result} from '../types';

export class UserController implements IController<IUser> {
  private readonly _path: string;
  private readonly _router: express.Router;
  private readonly _service: IService<IUser>;

  constructor(service: IService<IUser>, path?: string) {
    this._path = path || '/user';
    this._service = service;
    this._router = express.Router();

    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    /*
        @route  POST /api/user
        @desc   creates a user
        @access private
      */
    this._router.post(
      `${this._path}`,
      validationMiddleware({type: 'user'} as IUser),
      this.save
    );

    this._router
      .all(`${this._path}`, authenticationMiddlewware)
      .all(`${this._path}/:id`, authenticationMiddlewware)
      .all(`${this._path}/currentUser`, authenticationMiddlewware)

      /*
        @route  GET /api/user
        @desc   return a list of users
        @access private
      */
      .get(`${this._path}`, this.getAll)

      /*
        @route  GET /api/user/currentUser
        @desc   return the currentUser
        @access private
      */
      .get(`${this._path}/currentuser`, this.getCurrentUser)

      /*
        @route  GET /api/user/id
        @desc   returns a single user
        @access private
      */
      .get(`${this._path}/:id`, this.getOne)

      /*
        @route  PUT /api/user/id
        @desc   updates a single user's record
        @access private
      */
      .put(
        `${this._path}/:id`,
        validationMiddleware({type: 'updateUser'} as unknown as IUser),
        this.update
      )

      /*
        @route  DELETE /api/user/id
        @desc   deletes a single user's record
        @access private
      */
      .delete(`${this._path}/:id`, this.delete);
  };

  public get router() {
    return this._router;
  }

  public get path() {
    return this._path;
  }

  getAll = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const page = parseInt(req.query?.page as string);
      const size = parseInt(req.query?.size as string);

      const query = _.pick(req.query, ['username', 'email', 'role']) as IQuery;
      const queryResult = await this._service.getMany(page, size, query);

      if (queryResult.data) {
        let data = queryResult.data;
        data = (data as IUser[]).map((user: IUser) => {
          return _.pick(user, ['_id', 'username', 'email', 'role']) as IUser;
        });

        queryResult.set(data, queryResult.pagination, queryResult.error, 200);
      }

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getOne = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const query: IQuery = {_id: req.params.id};
      const queryResult = await this._service.getOne(query);

      let data = queryResult.data as IUser;

      data = _.pick(data, ['_id', 'username', 'email', 'role']) as IUser;

      queryResult.set(data, queryResult.pagination, queryResult.error, 200);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getCurrentUser = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const user = req.user;

      if (!user) next(new HttpException('No loggedin user.'));

      const data = _.pick(user, ['username', 'email', 'role']) as IUser;

      const queryResult = new Result<IUser>(data);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  save = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const queryResult = await this._service.save(req.body);

      let data = queryResult.data as IUser;

      data = _.pick(data, ['_id', 'username', 'email', 'role']) as IUser;

      queryResult.set(data, queryResult.pagination, queryResult.error, 200);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  update = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const _id = req.params.id as string;
      const query = {_id} as IQuery;
      let queryResult;

      if (!(await this._service.isExist(query)))
        throw new DoesNotExistException('User does not exist in database.');

      if (await this._service.isExist({email: req.body?.email} as IQuery)) {
        queryResult = await this._service.getOne({
          email: req.body?.email,
        } as IQuery);

        if (
          queryResult.data &&
          (queryResult.data as unknown as IQuery)._id?.toString() !== _id &&
          (queryResult.data as unknown as IQuery).email?.toString().trim() ===
            req.body?.email.trim()
        )
          throw new AlreadyExistException(
            'User with the same email already exists.'
          );
      }

      queryResult = await this._service.update({_id} as IQuery, req.body);
      let data = queryResult.data as IUser;

      data = _.pick(data, ['_id', 'username', 'email', 'role']) as IUser;
      queryResult.set(data, queryResult.pagination, queryResult.error, 200);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  delete = async (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ): Promise<void | IResponse> => {
    try {
      const _id = req.params.id as string;
      const query = {_id} as IQuery;

      if (!(await this._service.isExist(query)))
        throw new DoesNotExistException('User does not exist in database.');

      const queryResult = await this._service.delete({_id} as IQuery);
      let data = queryResult.data as IUser;

      data = _.pick(data, ['_id', 'username', 'email', 'role']) as IUser;
      queryResult.set(data, queryResult.pagination, queryResult.error, 200);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
