import jwt, { JwtPayload } from "jsonwebtoken";

const generateToken = (
  data: Record<string, unknown>,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(data, secret, { expiresIn });
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
