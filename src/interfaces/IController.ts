import express from 'express';
import {IRequest, IResponse} from '../interfaces';

export interface IController<T> {
  path: string;
  router: express.Router;
  getAll: (req: IRequest, res: IResponse) => Promise<IResponse>;
  getOne: (req: IRequest, res: IResponse) => Promise<IResponse>;
  save: (req: IRequest, res: IResponse) => Promise<IResponse>;
  update: (req: IRequest, res: IResponse) => Promise<IResponse>;
  delete: (req: IRequest, res: IResponse) => Promise<IResponse>;
}
