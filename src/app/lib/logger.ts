import { createLogger, format, transports, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config";

const { combine, timestamp, colorize, printf, json, errors } = format;

const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...metadata }) => {
    const meta =
      Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}${meta}`
      : `[${timestamp}] ${level}: ${message}${meta}`;
  }),
);

const productionFormat = combine(timestamp(), errors({ stack: true }), json());

const developmentTransports = [
  new transports.Console({ handleExceptions: true }),
];

const productionTransports = [
  new transports.Console({ handleExceptions: true }),
  new DailyRotateFile({
    filename: "logs/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "20m",
    maxFiles: "30d",
    zippedArchive: true,
  }),
  new DailyRotateFile({
    filename: "logs/combined-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    zippedArchive: true,
  }),
];

const logger: Logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format:
    config.NODE_ENV === "production" ? productionFormat : developmentFormat,
  transports:
    config.NODE_ENV === "production"
      ? productionTransports
      : developmentTransports,
  exitOnError: false,
});

export default logger;
