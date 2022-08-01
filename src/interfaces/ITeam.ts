import {IFixture} from './IFixture';

export interface ITeam {
  _id?: any;
  name: string;
  fixtures?: IFixture[];
  type?: 'team';
}
