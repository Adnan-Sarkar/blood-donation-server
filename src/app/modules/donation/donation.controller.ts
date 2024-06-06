import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DonationService } from "./donation.service";
import pickFromQueryParams from "../../utils/pickFromQueryParams";
import { donorListQueryParams } from "./donation.constant";
import { metaData } from "../../constant/metaData";

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

// Get All Requests Me As A Donor
const getAllMyDonationRequests = catchAsync(async (req, res) => {
  const metaInfo = pickFromQueryParams(req.query, metaData);

  const result = await DonationService.getAllMyDonationRequests(
    req.user,
    metaInfo
  );

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My donation requests retrieved successfully",
    data: result,
  });
});

// Get All Requests Me As A Requester
const getAllMyDonorRequest = catchAsync(async (req, res) => {
  const metaInfo = pickFromQueryParams(req.query, metaData);

  const result = await DonationService.getAllMyDonorRequest(req.user, metaInfo);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My donor requests retrieved successfully",
    data: result,
  });
});

// check donation request is sent or not
const checkDonationRequest = catchAsync(async (req, res) => {
  const { donorId, requesterId } = req.query;

  const result = await DonationService.checkDonationRequest(
    donorId as string,
    requesterId as string
  );

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Checking donation request successfully",
    data: result,
  });
});

// get donation request status
const getDonationRequestStatus = catchAsync(async (req, res) => {
  const { donorId, requesterId } = req.query;

  const result = await DonationService.getDonationRequestStatus(
    donorId as string,
    requesterId as string
  );

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrieved donation request status successfully",
    data: result,
  });
});

// update donation request status
const updateDonationRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;

  const result = await DonationService.updateDonationRequest(
    requestId,
    req.user,
    req.body
  );

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation request status successfully updated",
    data: result,
  });
});

// get donor list
const getDonorList = catchAsync(async (req, res) => {
  const filterData = pickFromQueryParams(req.query, donorListQueryParams);
  const metaInfo = pickFromQueryParams(req.query, metaData);

  const { meta, data } = await DonationService.getDonorList(
    filterData,
    metaInfo
  );

  sendResponse(res, true, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donors successfully found",
    meta,
    data,
  });
});

// complete request
const completeRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;

  const result = await DonationService.completeRequest(requestId, req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation request completed successfully",
    data: result,
  });
});

export const DonationController = {
  donationRequest,
  getAllDonationRequest,
  updateDonationRequest,
  getDonorList,
  getAllMyDonationRequests,
  getAllMyDonorRequest,
  checkDonationRequest,
  getDonationRequestStatus,
  completeRequest,
};
