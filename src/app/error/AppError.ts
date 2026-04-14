class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean = true;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
