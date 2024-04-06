import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

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
