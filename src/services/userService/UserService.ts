import {IQuery, IResult, IUser} from '../../interfaces';
import {IRepository} from '../../interfaces/IRepository';

export class UserService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }

  getAll = (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<IUser>> => {
    return this._repository.getMany(page, size, query);
  };

  getOne = (id: string): Promise<IResult<IUser>> => {
    return this._repository.getOne(id);
  };

  save = (user: IUser): Promise<IResult<IUser>> => {
    return this._repository.save(user);
  };

  update = (id: string, user: IUser): Promise<IResult<IUser>> => {
    return this._repository.update(id, user);
  };
}
