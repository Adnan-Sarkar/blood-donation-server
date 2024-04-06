import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import zodErrorHandler from "../error/zodErrorHandler";

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const errorResponse = {
    success: false,
    message: error.message || "error mesage",
    errorDetails: error,
  };

  if (error instanceof ZodError) {
    const { message, issues } = zodErrorHandler(error);
    errorResponse.message = message;
    errorResponse.errorDetails = { issues };
  }

  res.status(httpStatus.BAD_REQUEST).json(errorResponse);
};

export default globalErrorHandler;
