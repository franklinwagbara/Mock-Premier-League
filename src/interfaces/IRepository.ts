import {IQuery} from './IQuery';
import {IResult} from './IResult';

export interface IRepository<T> {
  getMany: (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ) => Promise<IResult<T>>;
  getOne: (id: string) => Promise<IResult<T>>;
  save: (data: T) => Promise<IResult<T>>;
  update: (id: string, data: T) => Promise<IResult<T>>;
  delete: (query: IQuery) => Promise<IResult<T>>;
}
