import Joi from 'joi';
import {Schema, model} from 'mongoose';
import {IFixture} from '../interfaces/IFixture';

export const validateFixture = (fixture: IFixture) => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(30).required(),
    home_team: Joi.string().required(),
    away_team: Joi.string().required(),
    status: Joi.string().required(),
  });
};
