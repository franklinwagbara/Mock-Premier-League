import _ from 'lodash';
import {FilterQuery, Model} from 'mongoose';
import {DoesNotExistException} from '../exceptions';
import {normalizeQuery} from '../helpers';
import {IQuery, IResult, IPagination} from '../interfaces';
import {IRepository} from '../interfaces/IRepository';
import {FixtureModel, TeamModel} from '../models';
import {Pagination, Result} from '../types';

export class MongoDbRepository<T> implements IRepository<T> {
  private readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  getMany = async (
    page: number | undefined,
    size: number | undefined,
    query: IQuery
  ): Promise<IResult<T>> => {
    page = !page || page < 1 ? 1 : page;
    size = !size || size < 1 ? 10 : size;

    const startIndex = page - 1;
    const endIndex = page * size - 1;

    let data: T[];
    let pagination: IPagination = new Pagination();
    let result: IResult<T> = new Result<T>();
    const modelName = this._model.modelName;

    try {
      query = normalizeQuery(query);

      if (modelName === 'Fixture')
        data = await this._model
          .find(query as FilterQuery<string>)
          .populate('home_team')
          .populate('away_team')
          .exec();
      else if (modelName === 'Team')
        data = await this._model
          .find(query as FilterQuery<string>)
          .populate('fixtures');
      else data = await this._model.find(query as FilterQuery<string>);

      pagination.size = size;
      pagination.total = data.length;

      if (endIndex < data.length) {
        pagination.next = page + 1;
      }

      if (startIndex > 0) {
        pagination.previous = page - 1;
      }

      data = _.slice(data, startIndex, endIndex);
      result.set(data, pagination, null, 200);
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  isExist = async (query: IQuery): Promise<boolean> => {
    try {
      query = normalizeQuery(query);

      const res = await this._model.findOne(query as FilterQuery<T>);

      if (!res) return false;
      else return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getOne = async (query: IQuery): Promise<IResult<T>> => {
    let data: T;
    let result: IResult<T> = new Result<T>();
    const modelName = this._model.modelName;

    console.log('modelName.....', modelName);

    try {
      query = normalizeQuery(query);

      if (modelName === 'Fixture') {
        data = (await this._model
          .findOne(query as FilterQuery<string>)
          .populate('home_team')
          .populate('away_team')
          .exec()) as T;
      } else if (modelName === 'Team') {
        data = (await this._model
          .findOne(query as FilterQuery<string>)
          .populate('fixtures')
          .exec()) as T;
      } else
        data = (await this._model.findOne(query as FilterQuery<string>)) as T;

      result.set(data, null, null, 200);
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  save = async (data: T): Promise<IResult<T>> => {
    try {
      const result = new Result<T>();

      const newData = new this._model(data);
      await newData.save();

      result.set(newData, null, null, 200);
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  update = async (query: IQuery, data: T): Promise<IResult<T>> => {
    const result = new Result<T>();
    query = normalizeQuery(query);

    try {
      if (!(await this.isExist(query))) throw new DoesNotExistException();

      const newData = await this._model.findOneAndUpdate(
        query as FilterQuery<T>,
        data,
        {
          new: true,
        }
      );

      result.set(newData, null, null, 200);
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  delete = async (query: IQuery): Promise<IResult<T>> => {
    const result = new Result<T>();
    query = normalizeQuery(query);

    if (!(await this.isExist(query))) throw new DoesNotExistException();

    try {
      const newData = await this._model.findOneAndDelete(
        query as FilterQuery<T>
      );

      result.set(newData, null, null, 200);
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
