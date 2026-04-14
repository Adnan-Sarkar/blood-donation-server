import morgan, { StreamOptions } from "morgan";
import { RequestHandler } from "express";
import logger from "../lib/logger";
import { config } from "../config";

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

const skipInTest = (): boolean => config.NODE_ENV === "test";

const httpLogger: RequestHandler = morgan(
  config.NODE_ENV === "production"
    ? ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    : ":method :url :status :response-time ms",
  {
    stream,
    skip: skipInTest,
  }
) as RequestHandler;

export default httpLogger;
