import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import { config } from "../config";

const skipInTest = (): boolean => config.NODE_ENV === "test";

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: skipInTest,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: httpStatus.TOO_MANY_REQUESTS,
    message: "Too many requests, please try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: skipInTest,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: httpStatus.TOO_MANY_REQUESTS,
    message: "Too many authentication attempts, please try again later.",
  },
});
