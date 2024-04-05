import express, { Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./app/routes";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api", router);

// basic route
app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Blood Donation API",
  });
});

export default app;
