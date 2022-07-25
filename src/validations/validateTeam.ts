import Joi from 'joi';
import {Schema, model} from 'mongoose';
import {ITeam} from '../interfaces/ITeam';

export const validateTeam = (team: ITeam) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    fixtures: Joi.array(),
  });

  return schema.validate(team, {abortEarly: false});
};
