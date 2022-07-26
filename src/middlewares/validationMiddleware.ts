import {NextFunction} from 'express-serve-static-core';
import {ValidationResult} from 'joi';
import {HttpException} from '../exceptions';
import {IFixture, IRequest, IResponse, ITeam, IUser} from '../interfaces';
import {Result} from '../types';
import {extractJoiErrors} from '../utils/extractJoiErrors';
import {
  validateFixture,
  validateRegister,
  validateTeam,
  validateUser,
} from '../validations';

export const validationMiddleware = ({type}: IUser | ITeam | IFixture) => {
  return (req: IRequest, res: IResponse, next: NextFunction) => {
    let result: ValidationResult | null = null;

    if (type === 'user') result = validateUser(req.body);
    else if (type === 'team') result = validateTeam(req.body);
    else if (type === 'fixture') result = validateFixture(req.body);
    else if (type === 'register') result = validateRegister(req.body);
    else next(new HttpException('Wrong input fields.', 400));

    if (!result?.error) return next();
    else return next(new HttpException(extractJoiErrors(result.error), 400));
  };
};
