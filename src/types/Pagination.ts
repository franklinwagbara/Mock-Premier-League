import {IPagination} from '../interfaces';

export class Pagination implements IPagination {
  next: number | null;
  previous: number | null;
  size: number | null;
  total: number | null;

  constructor(
    next?: number | null,
    previous?: number | null,
    size?: number | null,
    total?: number | null
  ) {
    this.next = next || null;
    this.previous = previous || null;
    this.size = size || null;
    this.total = total || null;
  }

  public set(
    next?: number | null,
    previous?: number | null,
    size?: number | null,
    total?: number | null
  ) {
    this.next = next || null;
    this.previous = previous || null;
    this.size = size || null;
    this.total = total || null;
  }
}
