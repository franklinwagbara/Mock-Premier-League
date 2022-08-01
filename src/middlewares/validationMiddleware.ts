import {NextFunction} from 'express-serve-static-core';
import {ValidationResult} from 'joi';
import {HttpException} from '../exceptions';
import {IFixture, IRequest, IResponse, ITeam, IUser} from '../interfaces';
import {extractJoiErrors} from '../utils/extractJoiErrors';
import {
  validateFixture,
  validateLogin,
  validateRegister,
  validateTeam,
  validateUser,
  validateUserUpdate,
} from '../validations';

export const validationMiddleware = ({type}: IUser | ITeam | IFixture) => {
  return (req: IRequest, res: IResponse, next: NextFunction) => {
    let result: ValidationResult | null = null;

    if (type === 'user') result = validateUser(req.body);
    else if (type === 'team') result = validateTeam(req.body);
    else if (type === 'fixture') result = validateFixture(req.body);
    else if (type === 'register') result = validateRegister(req.body);
    else if (type === 'login') result = validateLogin(req.body);
    else if (type === 'updateUser') result = validateUserUpdate(req.body);
    else next(new HttpException('Wrong input fields.', 400));

    if (!result?.error) return next();
    else next(new HttpException(extractJoiErrors(result.error), 400));
  };
};
