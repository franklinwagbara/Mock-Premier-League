import {
  AlreadyExistException,
  AuthenticationException,
  UnknownException,
} from '../../exceptions';
import {normalizeQuery} from '../../helpers';
import {IQuery, IResult, IUser} from '../../interfaces';
import {IRepository} from '../../interfaces/IRepository';
import {WebTokenService} from '../webTokenService/WebTokenService';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import {Roles} from '../../types';
import {ITokenData} from '../../interfaces/ITokenData';

export class AuthenticationService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }
  register = async (user: IUser) => {
    const webToken = new WebTokenService();
    const query: IQuery = normalizeQuery({email: user.email} as IQuery);

    try {
      if (await this._repository.isExist(query))
        throw new AlreadyExistException('User already exists');

      //hash password
      const hashedPassword = await bcrypt.hash(user.password as string, 10);

      //persist user
      user.password = hashedPassword;
      user.role = Roles.User;

      user = _.pick(user, ['username', 'email', 'role', 'password']);
      let {data} = await this._repository.save(user);

      //generate token
      const newUser = _.pick(data, ['username', 'email', 'role']);
      const token = webToken.signToken({data: newUser} as ITokenData<IUser>);

      //return {token, user}
      return {token, user: newUser};
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  login = async (user: IUser) => {
    const webToken = new WebTokenService();
    const query: IQuery = normalizeQuery({email: user.email} as IQuery);

    try {
      if (!(await this._repository.isExist(query)))
        throw new AuthenticationException();

      //hash password
      let user_in_db = (await this._repository.getOne(query)).data as IUser;
      const passwordMatch = await bcrypt.compare(
        user.password as string,
        user_in_db.password as string
      );

      if (!passwordMatch) throw new AuthenticationException();

      //generate token
      user_in_db = _.pick(user_in_db, ['username', 'email', 'role']);
      const token = webToken.signToken({data: user_in_db} as ITokenData<IUser>);

      //return {token, user}
      return {token, user: user_in_db};
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
