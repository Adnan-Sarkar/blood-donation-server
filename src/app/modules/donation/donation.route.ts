import express from "express";
import auth from "../../middleware/auth";
import { DonationController } from "./donation.controller";

const donationRequest = express.Router();

donationRequest.post("/", auth(), DonationController.donationRequest);

donationRequest.get("/", auth(), DonationController.getAllDonationRequest);

const donorList = express.Router();

export const DonationRequestRoute = donationRequest;
export const DonorListRoute = donorList;
