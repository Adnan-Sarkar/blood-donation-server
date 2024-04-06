import TJWTPayload from "../types/jwtPayload.type";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
    }
  }
}
