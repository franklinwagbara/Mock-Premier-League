import {AlreadyExistException, DoesNotExistException} from '../../exceptions';
import {IQuery, IRepository, IResult, IService, ITeam} from '../../interfaces';

export class TeamService implements IService<ITeam> {
  private readonly _repository: IRepository<ITeam>;

  constructor(repository: IRepository<ITeam>) {
    this._repository = repository;
  }

  getMany = async (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<ITeam>> => {
    return await this._repository.getMany(page, size, query);
  };

  getOne = async (query: IQuery): Promise<IResult<ITeam>> => {
    try {
      if (!(await this.isExist(query))) {
        throw new DoesNotExistException('Team does not exist in the database.');
      }

      return await this._repository.getOne(query);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  isExist = async (query: IQuery): Promise<boolean> => {
    return await this._repository.isExist(query);
  };

  save = async (team: ITeam): Promise<IResult<ITeam>> => {
    try {
      if (await this._repository.isExist({name: team?.name.trim()})) {
        throw new AlreadyExistException(
          'Team with the same name already exists.'
        );
      }

      return await this._repository.save(team);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  update = async (query: IQuery, team: ITeam): Promise<IResult<ITeam>> => {
    return await this._repository.update(query, team);
  };
  delete = async (query: IQuery): Promise<IResult<ITeam>> => {
    return await this._repository.delete(query);
  };
}
