import express from "express";
import auth from "../../middleware/auth";
import { UserController } from "./user.controller";

const userRouter = express.Router();

userRouter.get("/", auth("ADMIN", "SUPER_ADMIN"), UserController.getAllUsers);

userRouter.put(
  "/:userId",
  auth("ADMIN", "SUPER_ADMIN"),
  UserController.changeUserStatus
);

export const UserRoute = userRouter;
