import { ITokenUser } from './src/tools/models';
declare module 'express' {
  export interface Request {
    user?: ITokenUser;
  }
}
