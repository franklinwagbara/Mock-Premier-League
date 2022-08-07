import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {AuthenticationController} from '../controllers';
import {IController, IDatabaseConnection, IUser} from '../interfaces';
import {cacheMiddleware, errorHandlingMiddleware} from '../middlewares';
import rateLimit from 'express-rate-limit';

export class App {
  private readonly _app: express.Application;
  private readonly _database: IDatabaseConnection;
  private readonly _port: string | number;
  private readonly _controllers: IController<IUser>[];
  private readonly _authController: AuthenticationController;

  constructor(
    database: IDatabaseConnection,
    controllers: IController<IUser>[]
  ) {
    this._app = express();
    this._database = database;
    this._port = process.env.PORT || 3000;
    this._controllers = controllers;
    this._authController = new AuthenticationController();
  }

  private initializeComponents = async () => {
    await this.initiateDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeCaching();
    this.initializeControllers();
    this.initializeErrorHandling();
  };

  private initiateDatabaseConnection = async () => {
    try {
      await this._database.connect();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  private initializeMiddlewares = (): void => {
    console.log('\nInitializing middlewares....');

    this._app.use(express.json());
    this._app.use(
      helmet({
        contentSecurityPolicy: true,
      })
    );
    this._app.use(cookieParser());

    //rate limiter on user and authentication Api access
    const userAccessLimiter = rateLimit({
      windowMs: 5000,
      max: 20,
      message: 'Exceeded number of requests allowed.',
      standardHeaders: true,
      legacyHeaders: false,
    });

    this._app.use('/api/user/', userAccessLimiter);
    this._app.use('/api/auth/', userAccessLimiter);
    console.log('Initialization of middlewares completed.\n');
  };

  private initializeCaching = () => {
    this._app.use(cacheMiddleware);
  };

  private initializeErrorHandling = () => {
    this._app.use(errorHandlingMiddleware);
  };

  private initializeControllers = (): void => {
    console.log('\nInitializing controllers....');

    this._app.use('/api/', this._authController.router);
    this._controllers.forEach(controller => {
      this._app.use('/api/', controller.router);
    });

    console.log('Initialization of controllers completed.\n');
  };

  public listen = () => {
    this._app.listen(this._port, () =>
      console.log(`\nServer is Listening on port ${this._port}...\n`)
    );
  };

  public run = async () => {
    try {
      await this.initializeComponents();
      this.listen();
    } catch (error) {
      console.error(error);
    }
  };
}
