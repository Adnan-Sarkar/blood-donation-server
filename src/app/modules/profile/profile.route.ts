import express from "express";
import auth from "../../middleware/auth";
import { ProfileController } from "./profile.controller";

const router = express.Router();

router.get("/", auth(), ProfileController.getMyProfile);

export const ProfileRoute = router;
