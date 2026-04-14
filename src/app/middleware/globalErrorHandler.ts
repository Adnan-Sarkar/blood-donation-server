import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import zodErrorHandler from "../error/zodErrorHandler";
import AppError from "../error/AppError";
import logger from "../lib/logger";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let errorDetails: Record<string, unknown> | null = null;

  if (error instanceof ZodError) {
    const { message: zodMessage, issues } = zodErrorHandler(error);
    statusCode = httpStatus.BAD_REQUEST;
    message = zodMessage;
    errorDetails = { issues };
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    statusCode = httpStatus.CONFLICT;
    message = "A record with this value already exists.";
  }

  logger.error(message, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: error instanceof Error ? error.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
