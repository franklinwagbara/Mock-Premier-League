import {AlreadyExistException, DoesNotExistException} from '../../exceptions';
import {IQuery, IResult, IUser, IRepository} from '../../interfaces';
import bcrypt from 'bcrypt';
import {Roles} from '../../types';

export class UserService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }

  getMany = async (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<IUser>> => {
    return await this._repository.getMany(page, size, query);
  };

  getOne = async (query: IQuery): Promise<IResult<IUser>> => {
    if (!(await this.isExist(query)))
      throw new DoesNotExistException('User does not exist in the database.');

    return await this._repository.getOne(query);
  };

  isExist = async (query: IQuery): Promise<boolean> => {
    return await this._repository.isExist(query);
  };

  save = async (user: IUser): Promise<IResult<IUser>> => {
    try {
      if (await this._repository.isExist({email: user.email}))
        throw new AlreadyExistException('User already exists');

      //hash password
      const hashedPassword = await bcrypt.hash(user.password as string, 10);

      //persist user
      user.password = hashedPassword;
      user.role = Roles.User;

      return await this._repository.save(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  update = async (query: IQuery, user: IUser): Promise<IResult<IUser>> => {
    return await this._repository.update(query, user);
  };

  delete = async (query: IQuery): Promise<IResult<IUser>> => {
    return await this._repository.delete(query);
  };
}
