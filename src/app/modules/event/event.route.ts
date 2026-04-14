import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { EventController } from "./event.controller";
import { EventValidation } from "./event.validation";

const eventRouter = express.Router();

eventRouter.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  validateRequest(EventValidation.createEventValidationSchema),
  EventController.createBloodDonationEvent
);

eventRouter.post("/event-registration/:eventId", auth("USER"), EventController.registrationBloodDonationEvent);

eventRouter.patch(
  "/event-registration/:eventId",
  auth("ADMIN", "SUPER_ADMIN"),
  validateRequest(EventValidation.updateEventValidationSchema),
  EventController.updateBloodDonationEvent
);

eventRouter.get("/:eventId", EventController.getSingleEvent);

eventRouter.get("/", EventController.getAllEvents);

export const EventRoute = eventRouter;
