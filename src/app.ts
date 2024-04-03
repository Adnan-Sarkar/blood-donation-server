import express, { Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import exp from "constants";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// basic route
app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Blood Donation API",
  });
});

export default app;
