import express, {NextFunction} from 'express';
import {IRequest, IResponse} from '../interfaces';

export interface IController<T> {
  path: string;
  router: express.Router;
  getAll: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => Promise<void | IResponse>;
  getOne: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => Promise<void | IResponse>;
  save: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => Promise<void | IResponse>;
  update: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => Promise<void | IResponse>;
  delete: (
    req: IRequest,
    res: IResponse,
    next: NextFunction
  ) => Promise<void | IResponse>;
}
