import {IUser} from '../interfaces';
import {IRepository} from '../interfaces/IRepository';

export class AuthenticationService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }
  register = (user: IUser) => {};
  login = (user: IUser) => {};
}
