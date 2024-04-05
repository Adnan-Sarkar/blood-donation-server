import httpStatus from "http-status";
import AppError from "../error/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";

const auth = () => {
  return catchAsync((req, _res, next) => {
    const token = req.headers.authorization as string;

    let decode;

    try {
      decode = jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as string
      ) as JwtPayload;
    } catch (error: any) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    next();
  });
};

export default auth;
