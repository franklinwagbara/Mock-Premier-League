import {IPagination} from './IPagination';

export interface IResult<T> {
  data: T | T[] | null;
  pagination: IPagination | null;
  error: Error | string | null;
  status: number | 200;
  set: (
    data: T | T[] | null,
    pagination: IPagination | null,
    error: Error | null,
    status: number
  ) => void;
}
