import { RequestHandler } from "express";
import httpStatus from "http-status";

const notFound: RequestHandler = (req, res, _next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    errorDetails: `API endpoint: ${req.url} is not valid!`,
  });
};

export default notFound;
