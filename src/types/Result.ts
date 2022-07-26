import {IPagination, IResult} from '../interfaces';

export class Result<T> implements IResult<T> {
  data: T | T[] | null;
  pagination: IPagination | null;
  error: Error | string | null;
  status: number;

  constructor(
    data?: T | T[] | null,
    pagination?: IPagination | null,
    error?: Error | string | null,
    status?: number
  ) {
    this.data = data || null;
    this.pagination = pagination || null;
    this.error = error || null;
    this.status = status || 200;
  }

  public set(
    data: T | T[] | null,
    pagination: IPagination | null,
    error: Error | string | null,
    status: number
  ) {
    this.data = data;
    this.pagination = pagination;
    this.error = error;
    this.status = status;
  }
}
