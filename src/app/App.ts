import express from 'express';
import helmet from 'helmet';
import {IController, IDatabaseConnection, IUser} from '../interfaces';

export class App {
  private readonly _app: express.Application;
  private readonly _database: IDatabaseConnection;
  private readonly _port: string | number;
  private readonly _controllers: IController<IUser>[];

  constructor(
    database: IDatabaseConnection,
    port: string | number,
    controllers: IController<IUser>[]
  ) {
    this._app = express();
    this._database = database;
    this._port = process.env.PORT || 3000;
    this._controllers = controllers;
  }

  private initializeComponents = (): void => {
    this.initiateDatabaseConnection();
    this.initializeMiddlewares();
    this.initializeControllers();
  };

  private initiateDatabaseConnection = (): void => {
    this._database.connect();
  };

  private initializeMiddlewares = (): void => {
    console.log('\nInitializing middlewares....');

    this._app.use(express.json());
    this._app.use(
      helmet({
        contentSecurityPolicy: true,
      })
    );

    console.log('Initialization of middlewares completed.\n');
  };

  private initializeControllers = (): void => {
    this._controllers.forEach(controller => {
      this._app.use('/api/', controller.router);
    });
  };

  public run = (): void => {
    this.initializeComponents();
  };
}
