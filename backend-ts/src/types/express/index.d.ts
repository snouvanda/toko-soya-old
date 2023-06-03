import { JWTPayload } from "../custom"

export {}
declare global {
  namespace Express {
    export interface Request {
      jwtPayload: JWTPayload
    }
  }
}
