import {AlreadyExistException, DoesNotExistException} from '../../exceptions';
import {
  IFixture,
  IQuery,
  IRepository,
  IResult,
  IService,
  ITeam,
} from '../../interfaces';

export class FixtureService implements IService<IFixture> {
  private readonly _repository: IRepository<IFixture>;
  private readonly _teamService: IService<ITeam>;

  constructor(repository: IRepository<IFixture>, teamService: IService<ITeam>) {
    this._repository = repository;
    this._teamService = teamService;
  }
  public getMany = async (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<IFixture>> => {
    return await this._repository.getMany(page, size, query);
  };

  public getOne = async (query: IQuery): Promise<IResult<IFixture>> => {
    try {
      if (!(await this.isExist(query))) {
        throw new DoesNotExistException('Fixture does not exist.');
      }

      return await this._repository.getOne(query);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  public isExist = async (query: IQuery): Promise<boolean> => {
    return await this._repository.isExist(query);
  };

  public save = async (fixture: IFixture): Promise<IResult<IFixture>> => {
    try {
      if (await this._repository.isExist({title: fixture.title.trim()})) {
        throw new AlreadyExistException(
          'Fixture with the same title already exists.'
        );
      }

      const homeTeam = (
        await this._teamService.getOne({
          name: fixture.home_team as unknown as string,
        })
      ).data as ITeam;

      const awayTeam = (
        await this._teamService.getOne({
          name: fixture.away_team as unknown as string,
        })
      ).data as ITeam;

      const home_team_fixtures = new Set(homeTeam.fixtures);
      const away_team_fixtures = new Set(awayTeam.fixtures);

      fixture.home_team = homeTeam._id;
      fixture.away_team = awayTeam._id;

      const queryResult = await this._repository.save(fixture);

      home_team_fixtures.add((queryResult.data as any)._id);
      away_team_fixtures.add((queryResult.data as any)._id);

      await this._teamService.update(
        {
          name: homeTeam.name,
        },
        {
          name: homeTeam.name,
          fixtures: Array.from(home_team_fixtures),
        }
      );

      await this._teamService.update(
        {
          name: awayTeam.name,
        },
        {
          name: awayTeam.name,
          fixtures: Array.from(away_team_fixtures),
        }
      );

      const newFixture = await this._repository.save(fixture);
      return newFixture;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  public update = async (
    query: IQuery,
    data: IFixture
  ): Promise<IResult<IFixture>> => {
    return await this._repository.update(query, data);
  };

  public delete = async (query: IQuery): Promise<IResult<IFixture>> => {
    try {
      const {_id, home_team, away_team} = (await this._repository.getOne(query))
        .data as IFixture;

      home_team.fixtures = home_team.fixtures?.filter(
        fixture => fixture._id !== _id
      );

      away_team.fixtures = away_team.fixtures?.filter(
        fixture => fixture._id !== _id
      );

      await this._teamService.update({_id: home_team._id}, home_team);
      await this._teamService.update({_id: away_team._id}, away_team);

      return await this._repository.delete(query);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
