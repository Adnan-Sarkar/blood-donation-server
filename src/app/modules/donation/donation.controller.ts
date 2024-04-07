import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DonationService } from "./donation.service";

// donation request
const donationRequest = catchAsync(async (req, res) => {
  const result = await DonationService.donationRequest(req.body, req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Request successfully made",
    data: result,
  });
});

// get all donation request
const getAllDonationRequest = catchAsync(async (req, res) => {
  const result = await DonationService.getAllDonationRequest(req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

export const DonationController = {
  donationRequest,
  getAllDonationRequest,
};
