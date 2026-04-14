import Redis from "ioredis";
import { config } from "../config";
import logger from "./logger";

const createRedisClient = (): Redis | null => {
  if (!config.REDIS_URL) {
    logger.warn(
      "REDIS_URL is not configured. Queue features will be disabled.",
    );
    return null;
  }

  const client = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: (times: number) => Math.min(times * 500, 10000),
  });

  client.on("connect", () => logger.info("Redis client connected"));
  client.on("ready", () => logger.info("Redis client ready"));
  client.on("error", (err: Error) =>
    logger.error("Redis client error", { message: err.message }),
  );
  client.on("close", () => logger.warn("Redis client connection closed"));
  client.on("reconnecting", () => logger.info("Redis client reconnecting"));

  return client;
};

const redis = createRedisClient();

export default redis;
