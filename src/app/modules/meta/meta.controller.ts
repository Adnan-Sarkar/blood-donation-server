import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MetaServices } from "./meta.services";

// get meta info
const getMetaInfo = catchAsync(async (req, res) => {
  const result = await MetaServices.getMetaInfo(req.user);

  sendResponse(res, true, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donors successfully found",
    data: result,
  });
});

// get admin meta data
const getAdminMetadata = catchAsync(async (req, res) => {
  const result = await MetaServices.getAdminMetadata();

  sendResponse(res, true, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin metadata retrieved successfully",
    data: result,
  });
});

export const MetaController = {
  getMetaInfo,
  getAdminMetadata
};
