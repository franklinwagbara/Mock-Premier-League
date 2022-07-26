import {Exception} from './Exception';

export class UnknownException extends Exception {
  private _status: number;
  constructor(message?: string, status?: number) {
    super(message || 'Something went wrong.');
    this._status = status || 500;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
