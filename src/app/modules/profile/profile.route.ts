import express from "express";
import auth from "../../middleware/auth";
import { ProfileController } from "./profile.controller";
import validateRequest from "../../middleware/validateRequest";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

router.get("/", auth(), ProfileController.getMyProfile);

router.put(
  "/",
  auth(),
  validateRequest(ProfileValidation.updateProfileValidationSchema),
  ProfileController.updateMyProfile
);

export const ProfileRoute = router;
