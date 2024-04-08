import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import zodErrorHandler from "../error/zodErrorHandler";
import AppError from "../error/AppError";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const errorResponse = {
    success: false,
    message: error.message || "error mesage",
    errorDetails: error,
  };

  let statustCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof ZodError) {
    const { message, issues } = zodErrorHandler(error);
    errorResponse.message = message;
    errorResponse.errorDetails = { issues };
    statustCode = httpStatus.BAD_REQUEST;
  } else if (error instanceof AppError) {
    errorResponse.message = error.message;
    statustCode = error.statusCode;
  }

  res.status(statustCode).json(errorResponse);
};

export default globalErrorHandler;
