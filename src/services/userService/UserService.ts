import {IQuery, IResult, IUser} from '../../interfaces';
import {IRepository} from '../../interfaces/IRepository';

export class UserService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }

  getMany = (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<IUser>> => {
    return this._repository.getMany(page, size, query);
  };

  getOne = (query: IQuery): Promise<IResult<IUser>> => {
    return this._repository.getOne(query);
  };

  save = (user: IUser): Promise<IResult<IUser>> => {
    return this._repository.save(user);
  };

  update = (query: IQuery, data: IUser): Promise<IResult<IUser>> => {
    return this._repository.update(query, data);
  };

  delete = (query: IQuery): Promise<IResult<IUser>> => {
    return this._repository.delete(query);
  };
}
