import 'dotenv/config';
import {validateEnv} from './utils';
import {App} from './app';
import {
  MongoDbConnection,
  UserService,
  TeamService,
  FixtureService,
} from './services';
import {FixtureController, UserController, TeamController} from './controllers';
import {MongoDbRepository} from './repositories';
import {FixtureModel, TeamModel, UserModel} from './models';
import {IFixture, ITeam, IUser} from './interfaces';

validateEnv();

const app = new App(new MongoDbConnection(), [
  new UserController(new UserService(new MongoDbRepository<IUser>(UserModel))),
  new TeamController(new TeamService(new MongoDbRepository<ITeam>(TeamModel))),
  new FixtureController(
    new FixtureService(
      new MongoDbRepository<IFixture>(FixtureModel),
      new TeamService(new MongoDbRepository<ITeam>(TeamModel))
    )
  ),
]);

app.run();
