import {Exception} from './Exception';

export class DoesNotExistException extends Exception {
  private _status: number;
  constructor(message?: string, status?: number) {
    super(message || 'The resource you are looking for does not exist.');
    this._status = status || 404;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
