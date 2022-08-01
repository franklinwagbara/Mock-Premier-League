import express from 'express';
import {
  IController,
  IQuery,
  IRequest,
  IResponse,
  IService,
  ITeam,
} from '../interfaces';
import {
  adminAuthorizationMiddleware,
  authenticationMiddlewware,
  validationMiddleware,
} from '../middlewares';
import _ from 'lodash';
import {AlreadyExistException, DoesNotExistException} from '../exceptions';

export class TeamController implements IController<ITeam> {
  private readonly _path: string;
  private readonly _router: express.Router;
  private readonly _service: IService<ITeam>;
  constructor(service: IService<ITeam>, path?: string) {
    this._path = path || '/team';
    this._router = express.Router();
    this._service = service;

    this.initializeRoutes();
  }

  public get path() {
    return this._path;
  }

  public get router() {
    return this._router;
  }

  initializeRoutes = () => {
    this._router
      /*
            @route  GET /api/team
            @desc   return a list of teams
            @access public
        */
      .get(`${this._path}`, this.getAll);

    this._router
      .all(`${this._path}`, authenticationMiddlewware)
      .all(`${this._path}`, adminAuthorizationMiddleware)
      .all(`${this._path}/:id`, authenticationMiddlewware)
      .all(`${this._path}/:id`, adminAuthorizationMiddleware)

      /*
            @route  GET /api/team/id
            @desc   returns a single team
            @access private
       */
      .get(`${this._path}/:id`, this.getOne)

      /*
        @route  POST /api/team
        @desc   creates a team
        @access private (admin users only)
      */
      .post(
        `${this._path}`,
        validationMiddleware({type: 'team'} as ITeam),
        this.save
      )

      /*
        @route  PUT /api/team/id
        @desc   updates a single team's
        @access private (admin users only)
      */
      .put(
        `${this._path}/:id`,
        validationMiddleware({type: 'team'} as ITeam),
        this.update
      )

      /*
        @route  DELETE /api/team/id
        @desc   deletes a single team's record
        @access private (admin users only)
      */
      .delete(`${this._path}/:id`, this.delete);
  };

  getAll = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const page = parseInt(req.query?.page as string);
      const size = parseInt(req.query?.size as string);

      const query = _.pick(req.query, ['name']) as IQuery;

      const queryResult = await this._service.getMany(page, size, query);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getOne = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const query: IQuery = {_id: req.params.id};
      const queryResult = await this._service.getOne(query);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  save = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const queryResult = await this._service.save(req.body);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  update = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const _id = req.params.id as string;
      const query = {_id} as IQuery;
      let queryResult;

      if (!(await this._service.isExist(query))) {
        throw new DoesNotExistException('Team does not exist in the database.');
      }

      if (await this._service.isExist({name: req.body?.name} as IQuery)) {
        queryResult = await this._service.getOne({
          name: req.body?.name,
        } as IQuery);

        if (
          queryResult.data &&
          (queryResult.data as unknown as IQuery)._id?.toString() !== _id &&
          (queryResult.data as unknown as IQuery).name?.toString().trim() ===
            req.body?.name.trim()
        )
          throw new AlreadyExistException(
            'Team with the same name already exists.'
          );
      }

      queryResult = await this._service.update(query, req.body);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  delete = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const _id = req.params.id as string;
      const query = {_id} as IQuery;
      if (!(await this._service.isExist(query))) {
        throw new DoesNotExistException('Team does not exist in the database.');
      }

      const queryResult = await this._service.delete(query);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
