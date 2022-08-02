import express from 'express';
import {DoesNotExistException} from '../exceptions';
import {
  IController,
  IFixture,
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
import {cachedQuery, flushCache} from '../utils';
import {TeamService} from '../services';

export class FixtureController implements IController<IFixture> {
  private readonly _path: string;
  private readonly _router: express.Router;
  private readonly _service: IService<IFixture>;

  constructor(service: IService<IFixture>, path?: string) {
    this._service = service;
    this._path = path || '/fixture';
    this._router = express.Router();

    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    /*
        @Route  GET /api/fixture/   -- Query optional e.g: Get /api/fixture?title=psg vs chelsea
        @Desc   Returns a list of fixtures based on query parameters.
        @Access Public
    */
    this._router.get(`${this._path}`, this.getAll);

    this._router
      .all(`${this._path}`, authenticationMiddlewware)
      .all(`${this._path}`, adminAuthorizationMiddleware)
      .all(`${this._path}/:id`, authenticationMiddlewware)
      .all(`${this._path}/:id`, adminAuthorizationMiddleware)

      /*
        @route  GET /api/fixture/id
        @desc   returns a single fixture
        @access private
      */
      .get(`${this._path}/:id`, this.getOne)

      /*
        @route  POST /api/fixture
        @desc   creates a fixture
        @access private
      */
      .post(
        `${this._path}`,
        validationMiddleware({type: 'fixture'} as IFixture),
        this.save
      )

      /*
        @route  PUT /api/fixture/id
        @desc   updates a single fixture's record
        @access private
      */
      .put(
        `${this._path}/:id`,
        validationMiddleware({type: 'fixture'} as unknown as IFixture),
        this.update
      )

      /*
        @route  DELETE /api/fixture/id
        @desc   deletes a single fixture's record
        @access private
      */
      .delete(`${this._path}/:id`, this.delete);
  };

  public get path() {
    return this._path;
  }

  public get router() {
    return this._router;
  }

  public getAll = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const page = parseInt(req.query?.page as string);
      const size = parseInt(req.query?.size as string);
      const query = _.pick(req.query, [
        'title',
        'home_team',
        'away_team',
        'status',
      ]) as IQuery;

      const queryResult = await this._service.getMany(page, size, query);

      //cache result
      await cachedQuery(req.originalUrl, queryResult);

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
      const query = {_id: req.params.id as string} as IQuery;

      const queryResult = await this._service.getOne(query);

      //cache result
      await cachedQuery(req.originalUrl, queryResult);

      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  save = async (
    req: IRequest,
    res: IResponse,
    next: express.NextFunction
  ): Promise<void | IResponse> => {
    try {
      const fixture = {
        title: req.body.title,
        home_team: req.body.home_team,
        away_team: req.body.away_team,
        status: req.body.status,
      } as IFixture;

      const queryResult = await this._service.save(fixture);

      //flush cache
      await flushCache();

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

      //check if fixture with the given id exists
      if (!(await this._service.isExist(query))) {
        throw new DoesNotExistException('Fixture does not exist.');
      }

      const queryResult = await this._service.update(query, req.body);

      //flush cache
      await flushCache();

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

      //check to see if fixture with id exists
      if (!(await this._service.isExist(query))) {
        throw new DoesNotExistException('Fixture does not exist.');
      }

      //delete fixture if it exists
      const queryResult = await this._service.delete(query);

      //flush cache
      await flushCache();

      //return deleted fixture
      return res.status(200).send(queryResult);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
