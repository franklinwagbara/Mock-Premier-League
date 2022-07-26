import jwt from 'jsonwebtoken';

export class WebTokenService {
  private _token: string | null;

  constructor() {
    this._token = null;
  }

  public get token() {
    return this._token;
  }

  public signToken = (
    payload: string | object,
    expiresIn?: string | number,
    secret?: string
  ) => {
    this._token = jwt.sign(
      payload,
      secret || (process.env.JWT_SECRET as jwt.Secret),
      {
        expiresIn: expiresIn,
      }
    );

    return this._token;
  };

  public verifyToken = (token: string, secret?: string) => {
    const result = jwt.verify(
      token,
      secret || (process.env.JWT_SECRET as jwt.Secret)
    );

    return result;
  };
}
