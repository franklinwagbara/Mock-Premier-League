import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {AuthenticationController} from '../controllers';
import {IController, IDatabaseConnection, IUser} from '../interfaces';
import {errorHandlingMiddleware, validationMiddleware} from '../middlewares';

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
    this.initializeControllers();
    this.initializeErrorHandling();
  };

  private initiateDatabaseConnection = async () => {
    await this._database.connect();
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
    console.log('Initialization of middlewares completed.\n');
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
    await this.initializeComponents();
    this.listen();
  };
}
