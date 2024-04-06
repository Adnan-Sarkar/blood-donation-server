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

// update my profile
const updateMyProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.updateMyProfile(req.body, req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  getMyProfile,
  updateMyProfile,
};
