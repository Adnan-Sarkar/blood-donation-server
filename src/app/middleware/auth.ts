import httpStatus from "http-status";
import AppError from "../error/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "@prisma/client";

const auth = (...userRoles: (keyof typeof UserRole)[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization as string;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    let verifiedUser: JwtPayload;

    try {
      verifiedUser = jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = {
      id: verifiedUser.id,
      name: verifiedUser.name,
      email: verifiedUser.email,
      role: verifiedUser.role,
    };

    if (userRoles.length > 0 && !userRoles.includes(verifiedUser.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
    }

    next();
  });
};

export default auth;
