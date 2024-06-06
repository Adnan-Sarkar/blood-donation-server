import express from "express";
import auth from "../../middleware/auth";
import { ProfileController } from "./profile.controller";
import validateRequest from "../../middleware/validateRequest";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();
const donorRouter = express.Router();

router.get(
  "/",
  auth("ADMIN", "SUPER_ADMIN", "USER"),
  ProfileController.getMyProfile
);

router.put(
  "/",
  auth("ADMIN", "SUPER_ADMIN", "USER"),
  validateRequest(ProfileValidation.updateProfileAndUserDataValidationSchema),
  ProfileController.updateMyUserAndProfileData
);

donorRouter.get("/:donorId", ProfileController.getDonorProfile);

export const ProfileRoute = router;
export const DonorRoute = donorRouter;
