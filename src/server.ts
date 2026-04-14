import http from "http";
import app from "./app";
import { config } from "./app/config";
import logger from "./app/lib/logger";
import { initializeSocket, getIo } from "./app/lib/socket";
import { notificationWorker } from "./app/modules/queue";

const PORT = config.PORT;
const httpServer = http.createServer(app);

const startServer = async (): Promise<void> => {
  await initializeSocket(httpServer);

  httpServer.listen(PORT, () => {
    logger.info(`Server is running on PORT: ${PORT}`);

    if (notificationWorker) {
      notificationWorker.run();
      logger.info("Notification worker started");
    }
  });
};

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown.`);

  const io = getIo();
  if (io) {
    await io.close();
    logger.info("Socket.io server closed");
  }

  if (notificationWorker) {
    await notificationWorker.close();
    logger.info("Notification worker closed");
  }

  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startServer().catch((err) => {
  logger.error("Failed to start server", {
    error: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
