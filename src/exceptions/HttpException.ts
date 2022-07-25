import {Exception} from './Exception';

export class HttpException extends Exception {
  private _status: number;
  constructor(message: string, status: number) {
    super(message);
    this._status = status;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
