import express from "express";
import auth from "../../middleware/auth";
import { DonationController } from "./donation.controller";

const donationRequest = express.Router();

donationRequest.post("/", auth(), DonationController.donationRequest);

const donorList = express.Router();

export const DonationRequestRoute = donationRequest;
export const DonorListRoute = donorList;
