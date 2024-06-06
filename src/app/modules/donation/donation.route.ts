import express from "express";
import auth from "../../middleware/auth";
import { DonationController } from "./donation.controller";
import validateRequest from "../../middleware/validateRequest";
import { DonationValidation } from "./donation.validation";

const donationRequest = express.Router();

donationRequest.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN", "USER"),
  validateRequest(DonationValidation.bloodRequestValidationSchema),
  DonationController.donationRequest
);

donationRequest.get(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  DonationController.getAllDonationRequest
);

donationRequest.get(
  "/my-donor-requests",
  auth("USER"),
  DonationController.getAllMyDonorRequest
);

donationRequest.get(
  "/my-donation-requests",
  auth("USER"),
  DonationController.getAllMyDonationRequests
);

donationRequest.get(
  "/check-donation-request",
  auth("USER"),
  DonationController.checkDonationRequest
);

donationRequest.get(
  "/donation-request-status",
  auth("USER"),
  DonationController.getDonationRequestStatus
);

donationRequest.put(
  "/:requestId",
  auth("USER"),
  validateRequest(DonationValidation.updateDonationRequestValidationSchema),
  DonationController.updateDonationRequest
);

donationRequest.put(
  "/complete/:requestId",
  auth("USER"),
  DonationController.completeRequest
);

const donorList = express.Router();

donorList.get("/", DonationController.getDonorList);

export const DonationRequestRoute = donationRequest;
export const DonorListRoute = donorList;
