import {Exception} from './Exception';

export class AuthenticationTokenMissingException extends Exception {
  private _status: number;
  constructor(message?: string, status?: number) {
    super(message || 'Unauthorized access. Authentication token is missing.');
    this._status = status || 401;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
