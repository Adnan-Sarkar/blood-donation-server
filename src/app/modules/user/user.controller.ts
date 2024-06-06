import httpStatus from "http-status";
import { metaData } from "../../constant/metaData";
import catchAsync from "../../utils/catchAsync";
import pickFromQueryParams from "../../utils/pickFromQueryParams";
import sendResponse from "../../utils/sendResponse";
import { donorListQueryParams } from "../donation/donation.constant";
import { UserService } from "./user.service";

// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const filterData = pickFromQueryParams(req.query, donorListQueryParams);
  const metaInfo = pickFromQueryParams(req.query, metaData);

  const { meta, data } = await UserService.getAllUsers(filterData, metaInfo);

  sendResponse(res, true, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    meta,
    data,
  });
});

// change user status
const changeUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserService.changeUserStatus(userId, req.body);

  sendResponse(res, true, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status changed successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  changeUserStatus,
};
