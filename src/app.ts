import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app = express();

// middlewares
app.use(
  cors({
    origin: [
      "https://blood-donation-by-adnan-sarkar.vercel.app",
      "https://blood-donation-client-z7rd-9skayzepn-adnan-sarkars-projects.vercel.app/",
      " http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

// basic route
app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Blood Donation api",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
