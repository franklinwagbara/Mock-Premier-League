import Joi from 'joi';
import {IUser} from '../interfaces';

export const validateLogin = (user: IUser) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net', 'org', 'co']},
      })
      .required(),
    password: Joi.string().required(),
  });

  return schema.validate(user, {abortEarly: false});
};
