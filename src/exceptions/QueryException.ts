import {Exception} from './Exception';

export class QueryException extends Exception {
  status: number;

  constructor(message?: string, status?: number) {
    super(
      message || 'Something went wrong while trying to query the database.'
    );
    this.status = status || 500;
  }
}
