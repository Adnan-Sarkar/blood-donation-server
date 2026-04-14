import jwt from "jsonwebtoken";
import TJWTPayload from "../../src/app/types/jwtPayload.type";

const ACCESS_SECRET = process.env["JWT_ACCESS_SECRET"] as string;
const REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"] as string;
const ACCESS_EXPIRES_IN = process.env["JWT_ACCESS_EXPIRES_IN"] as string;
const REFRESH_EXPIRES_IN = process.env["JWT_REFRESH_EXPIRES_IN"] as string;

export function generateAccessToken(payload: TJWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function generateRefreshToken(payload: TJWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}
