import express from "express";
import auth from "../../middleware/auth";
import {EventController} from "./event.controller";

const eventRouter = express.Router();

eventRouter.post("/", auth("ADMIN", "SUPER_ADMIN"), EventController.createBloodDonationEvent);

eventRouter.post("/event-registration/:eventId", auth("USER"), EventController.registrationBloodDonationEvent);

eventRouter.patch("/event-registration/:eventId", auth("ADMIN", "SUPER_ADMIN"), EventController.updateBloodDonationEvent);

eventRouter.get("/", EventController.getAllEvents);

export const EventRoute = eventRouter;
