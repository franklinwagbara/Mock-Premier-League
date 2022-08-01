import {IQuery} from '../interfaces';

export const normalizeQuery = (query: IQuery): IQuery => {
  for (let key in query) {
    if (key === '_id') continue;
    query[key as keyof IQuery] = new RegExp(
      query[key as keyof IQuery] as string,
      'i'
    );
  }
  return query;
};
