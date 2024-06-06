import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import zodErrorHandler from "../error/zodErrorHandler";
import AppError from "../error/AppError";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const errorResponse = {
    success: false,
    statusCode: 500,
    message: error.message || "error message",
    errorDetails: error,
  };

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof ZodError) {
    const { message, issues } = zodErrorHandler(error);
    errorResponse.message = message;
    errorResponse.errorDetails = { issues };
    statusCode = httpStatus.BAD_REQUEST;
  } else if (error instanceof AppError) {
    errorResponse.message = error.message;
    statusCode = error.statusCode;
  }

  errorResponse.statusCode = statusCode;

  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;
