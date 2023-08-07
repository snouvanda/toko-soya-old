import { JWTPayload } from "@/types/custom";

export {};
declare global {
  namespace Express {
    export interface Request {
      jwtPayload: JWTPayload;
    }
  }
}
