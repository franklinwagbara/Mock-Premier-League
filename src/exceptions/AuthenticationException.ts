import {Exception} from './Exception';

export class AuthenticationException extends Exception {
  private _status: number;
  constructor(message?: string, status?: number) {
    super(message || 'There was a problem with your login credentials.');
    this._status = status || 400;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
