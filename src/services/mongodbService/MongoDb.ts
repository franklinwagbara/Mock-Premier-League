import {Model} from 'mongoose';
import {IQuery, IResult} from '../../interfaces';
import {IRepository} from '../../interfaces/IRepository';

export class MongoDbService<T> implements IRepository<T> {
  private readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  getMany = (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<T>> => {
    throw new Error('Not implemented');
  };
  getOne = (id: string): Promise<IResult<T>> => {
    throw new Error('Not implemented');
  };
  save = (data: T): Promise<IResult<T>> => {
    throw new Error('Not implemented');
  };
  update = (id: string, data: T): Promise<IResult<T>> => {
    throw new Error('Not implemented');
  };
  delete = (query: IQuery): Promise<IResult<T>> => {
    throw new Error('Not implemented');
  };
}
