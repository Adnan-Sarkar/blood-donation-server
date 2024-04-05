import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  res.status(httpStatus.BAD_REQUEST).json({
    success: false,
    message: error.message || "error mesage",
    errorDetails: error,
  });
};

export default globalErrorHandler;
