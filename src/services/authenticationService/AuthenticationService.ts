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

export class AuthenticationService {
  private readonly _repository: IRepository<IUser>;

  constructor(repository: IRepository<IUser>) {
    this._repository = repository;
  }
  register = async (user: IUser) => {
    const webToken = new WebTokenService();
    const query: IQuery = normalizeQuery({email: user.email} as IQuery);

    if (await this._repository.isExist(query))
      throw new AlreadyExistException('User already exists');

    try {
      //hash password
      const hashedPassword = await bcrypt.hash(user.password as string, 10);

      //persist user
      user.password = hashedPassword;
      user.role = Roles.User;

      user = _.pick(user, ['username', 'email', 'role', 'password']);
      let {data} = await this._repository.save(user);

      //generate token
      const newUser = _.pick(data, ['username', 'email', 'role']);
      const token = webToken.signToken({user: newUser});

      //return {token, user}
      return {token, newUser};
    } catch (error) {
      console.error(error);
      throw new UnknownException(
        'Something went wrong while trying to register user.'
      );
    }
  };
  login = async (user: IUser) => {
    const webToken = new WebTokenService();
    const query: IQuery = normalizeQuery({email: user.email} as IQuery);

    if (!(await this._repository.isExist(query)))
      throw new AuthenticationException();

    try {
      //hash password
      let user_in_db = (await this._repository.getOne(query)).data as IUser;
      const passwordMatch = await bcrypt.compare(
        user.password as string,
        user_in_db.password as string
      );

      if (!passwordMatch) throw new AuthenticationException();

      //generate token
      user_in_db = _.pick(user_in_db, ['username', 'email', 'role']);
      const token = webToken.signToken({user: user_in_db});

      //return {token, user}
      return {token, user_in_db};
    } catch (error) {
      console.error(error);
      throw new UnknownException(
        'Something went wrong while trying to register user.'
      );
    }
  };
}
