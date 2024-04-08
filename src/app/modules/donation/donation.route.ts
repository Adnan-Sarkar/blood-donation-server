import express from "express";
import auth from "../../middleware/auth";
import { DonationController } from "./donation.controller";
import validateRequest from "../../middleware/validateRequest";
import { DonationValidation } from "./donation.validation";

const donationRequest = express.Router();

donationRequest.post("/", auth(), DonationController.donationRequest);

donationRequest.get("/", auth(), DonationController.getAllDonationRequest);

donationRequest.put(
  "/:requestId",
  auth(),
  validateRequest(DonationValidation.updateDonationRequestValidationSchema),
  DonationController.updateDonationRequest
);

const donorList = express.Router();

donorList.get("/", DonationController.getDonorList);

export const DonationRequestRoute = donationRequest;
export const DonorListRoute = donorList;
