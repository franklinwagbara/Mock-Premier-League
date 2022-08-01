import {Exception} from './Exception';

export class HttpException extends Exception {
  private _status: number;
  constructor(error?: string | Exception, status?: number) {
    let message =
      'Something went wrong while trying to processing your request.';
    if (error && error instanceof Exception) {
      message = error.message;
      status = error.status;
    }

    if (typeof error === 'string') message = error;
    super(message);
    this._status = status || 500;
  }

  public get status() {
    return this._status;
  }

  public set status(status: number) {
    this._status = status;
  }
}
