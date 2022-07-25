import express, {Request, Response} from 'express';

export interface IController<T> {
  path: string;
  router: express.Router;
  getAll: (req: Request, res: Response) => Promise<Response>;
  getOne: (req: Request, res: Response) => Promise<Response>;
  save: (req: Request, res: Response) => Promise<Response>;
  update: (req: Request, res: Response) => Promise<Response>;
  delete: (req: Request, res: Response) => Promise<Response>;
}
