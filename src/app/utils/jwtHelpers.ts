import jwt, { JwtPayload } from "jsonwebtoken";
import TJWTPayload from "../types/jwtPayload.type";

const generateToken = (
  data: TJWTPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(data, secret, {
    expiresIn,
  });
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
