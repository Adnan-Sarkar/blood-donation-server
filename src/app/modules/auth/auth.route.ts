import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";

const authRouter = express.Router();
authRouter.post("/refresh-token", AuthController.refreshToken);
authRouter.post(
  "/change-password",
  auth("ADMIN", "SUPER_ADMIN", "USER"),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

const registrationRoute = express.Router();
registrationRoute.post(
  "/",
  validateRequest(AuthValidation.registrationValidationSchema),
  AuthController.registration
);

const loginRoute = express.Router();
loginRoute.post(
  "/",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

export { registrationRoute, loginRoute, authRouter };
