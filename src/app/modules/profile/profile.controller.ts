import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProfileService } from "./profile.service";

// get my profile
const getMyProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.getMyProfile(req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

// get donor profile
const getDonorProfile = catchAsync(async (req, res) => {
  const { donorId } = req.params;
  const result = await ProfileService.getDonorProfile(donorId);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donor profile retrieved successfully",
    data: result,
  });
});

// update my profile and user data
const updateMyUserAndProfileData = catchAsync(async (req, res) => {
  const result = await ProfileService.updateMyUserAndProfileData(
    req.body,
    req.user
  );

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
  updateMyUserAndProfileData,
  getDonorProfile,
};
