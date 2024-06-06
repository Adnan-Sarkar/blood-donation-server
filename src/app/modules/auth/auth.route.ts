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

const registration = express.Router();
registration.post(
  "/",
  validateRequest(AuthValidation.registrationValidationSchema),
  AuthController.registration
);

const login = express.Router();
login.post(
  "/",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

export const RegistrationRoute = registration;
export const loginRoute = login;
export const AuthRouter = authRouter;
