import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import logger from "./logger";

interface ServerToClientEvents {
  notification: (payload: {
    type: string;
    message: string;
    requestId?: string;
    newStatus?: string;
    timestamp: string;
  }) => void;
}

interface SocketData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

type TSocketServer = Server<
  Record<string, never>,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

let io: TSocketServer | null = null;

export const initializeSocket = async (
  httpServer: http.Server,
): Promise<void> => {
  const socketServer: TSocketServer = new Server(httpServer, {
    cors: {
      origin: [
        "https://blood-donation-by-adnan-sarkar.vercel.app",
        "https://blood-donation-client-z7rd-9skayzepn-adnan-sarkars-projects.vercel.app",
        "http://localhost:3000",
      ],
      credentials: true,
    },
  });

  if (config.REDIS_URL) {
    const pubClient = createClient({ url: config.REDIS_URL });
    const subClient = pubClient.duplicate();

    pubClient.on("error", (err: Error) =>
      logger.error("Socket.io Redis pub client error", {
        message: err.message,
      }),
    );
    subClient.on("error", (err: Error) =>
      logger.error("Socket.io Redis sub client error", {
        message: err.message,
      }),
    );

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);
      socketServer.adapter(createAdapter(pubClient, subClient));
      logger.info("Socket.io Redis adapter initialized");
    } catch (err) {
      logger.warn(
        "Socket.io Redis adapter unavailable, running in single-server mode",
        {
          message: err instanceof Error ? err.message : String(err),
        },
      );
    }
  }

  socketServer.use((socket, next) => {
    const token =
      (socket.handshake.auth?.token as string | undefined) ??
      (socket.handshake.headers?.authorization as string | undefined);

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(
        token,
        config.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      socket.data.user = {
        id: decoded.id as string,
        name: decoded.name as string,
        email: decoded.email as string,
        role: decoded.role as string,
      };

      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  socketServer.on("connection", (socket) => {
    const userId = socket.data.user.id;
    socket.join(`user:${userId}`);
    logger.info("Socket connected", { userId, socketId: socket.id });

    socket.on("disconnect", (reason) => {
      logger.info("Socket disconnected", {
        userId,
        socketId: socket.id,
        reason,
      });
    });
  });

  io = socketServer;
  logger.info("Socket.io server initialized");
};

export const getIo = (): TSocketServer | null => io;
