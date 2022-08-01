import {GameStatus} from '../types';
import {ITeam} from './ITeam';

export interface IFixture {
  _id?: any;
  title: string;
  home_team: ITeam;
  away_team: ITeam;
  status: GameStatus;
  type: 'fixture';
}
