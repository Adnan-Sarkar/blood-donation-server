import express, { Request, Response } from "express";
import redis from "./app/lib/redis";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import httpStatus from "http-status";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import {
  authRateLimiter,
  globalRateLimiter,
} from "./app/middleware/rateLimiter";
import httpLogger from "./app/middleware/httpLogger";

const app = express();

app.use(helmet());
app.use(compression());
app.use(httpLogger);
app.use(
  cors({
    origin: [
      "https://blood-donation-by-adnan-sarkar.vercel.app",
      "https://blood-donation-client-z7rd-9skayzepn-adnan-sarkars-projects.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(globalRateLimiter);
app.use(
  ["/api/v1/register", "/api/v1/login", "/api/v1/auth/refresh-token"],
  authRateLimiter,
);
app.use("/api/v1", router);

app.get("/health", async (_req: Request, res: Response) => {
  let redisStatus: "connected" | "disconnected" | "unconfigured" =
    "unconfigured";

  if (redis) {
    try {
      await redis.ping();
      redisStatus = "connected";
    } catch {
      redisStatus = "disconnected";
    }
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Server is healthy",
    redis: { status: redisStatus },
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Blood Donation api",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
