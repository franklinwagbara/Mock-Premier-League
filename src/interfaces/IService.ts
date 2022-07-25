import {Model, Query} from 'mongoose';
import {IResult, IQuery} from '../interfaces';

export interface IService<T> {
  getMany: (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ) => Promise<IResult<T>>;
  save: (data: T) => Promise<IResult<T>>;
  update: (data: T) => Promise<IResult<T>>;
  delete: (query: IQuery) => Promise<IResult<T>>;
}
