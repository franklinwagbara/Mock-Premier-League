import {Exception} from './Exception';

export class ForbiddenException extends Exception {
  private _status: number;
  constructor(message?: string) {
    super(message || 'Access denied. You do not have the required permission.');
    this._status = 403;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
