import {Roles} from '../types';

export interface IUser {
  username: string;
  email: string;
  role: Roles;
  password: string;
  confirm_password: string;
}
