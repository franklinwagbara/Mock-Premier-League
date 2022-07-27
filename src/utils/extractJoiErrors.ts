import Joi from 'joi';

export const extractJoiErrors = (error: Joi.ValidationError) => {
  const res = {} as any;
  for (let item of error.details) res[item.path[0]] = item.message;
  return JSON.stringify(res);
};
