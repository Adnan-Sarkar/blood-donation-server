import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const userRouter = express.Router();

userRouter.get("/", auth("ADMIN", "SUPER_ADMIN"), UserController.getAllUsers);

userRouter.put(
  "/:userId",
  auth("ADMIN", "SUPER_ADMIN"),
  validateRequest(UserValidation.changeUserStatusValidationSchema),
  UserController.changeUserStatus
);

export const UserRoute = userRouter;
