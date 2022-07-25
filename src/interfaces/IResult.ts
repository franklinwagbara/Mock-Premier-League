export interface IResult<T> {
  data: T | T[] | null;
  error: Error;
  status: number | 200;
}
