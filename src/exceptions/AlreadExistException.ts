import {Exception} from './Exception';

export class AlreadyExistException extends Exception {
  private _status: number;
  constructor(message?: string, status?: number) {
    super(message || 'This resource already exist.');
    this._status = status || 400;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
