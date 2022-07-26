import {IResult, IQuery} from '../interfaces';

export interface IRepository<T> {
  getMany: (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ) => Promise<IResult<T>>;
  getOne: (query: IQuery) => Promise<IResult<T>>;
  isExist: (query: IQuery) => Promise<boolean>;
  save: (data: T) => Promise<IResult<T>>;
  update: (query: IQuery, data: T) => Promise<IResult<T>>;
  delete: (query: IQuery) => Promise<IResult<T>>;
}
