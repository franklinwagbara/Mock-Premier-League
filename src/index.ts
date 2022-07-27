import 'dotenv/config';
import {App} from './app';
import {MongoDbConnection, UserService} from './services';
import {validateEnv} from './utils';
import {UserController} from './controllers';
import {MongoDbRepository} from './repositories';
import {UserModel} from './models';
import {IUser} from './interfaces';
import {Model} from 'mongoose';

validateEnv();

const app = new App(new MongoDbConnection(), [
  new UserController(
    new UserService(new MongoDbRepository<IUser>(UserModel as Model<IUser>))
  ),
]);

app.run();
