import Joi from 'joi';
import {IUser} from '../interfaces';

export const validateRegister = (user: IUser) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net', 'org', 'co']},
      })
      .required(),
    role: Joi.string(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
    confirm_password: Joi.ref('password'),
  }).with('password', 'confirm_password');

  return schema.validate(user, {abortEarly: false});
};
