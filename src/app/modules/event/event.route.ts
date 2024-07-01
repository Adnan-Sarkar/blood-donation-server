import express from "express";
import auth from "../../middleware/auth";
import {EventController} from "./event.controller";

const eventRouter = express.Router();

eventRouter.post("/", auth("ADMIN", "SUPER_ADMIN"), EventController.createBloodDonationEvent);

eventRouter.post("/event-registration/:eventId", auth("USER"), EventController.registrationBloodDonationEvent);

export const EventRoute = eventRouter;
