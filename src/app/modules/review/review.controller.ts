import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";
import pickFromQueryParams from "../../utils/pickFromQueryParams";
import { metaData } from "../../constant/metaData";

// create review
const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReview(req.user, req.body);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

// get user review
const getUserReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.getUserReview(req.user);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User review retrieved successfully",
    data: result,
  });
});

// get all reviews
const getAllReviews = catchAsync(async (req, res) => {
  const metaInfo = pickFromQueryParams(req.query, metaData);
  const result = await ReviewServices.getAllReviews(metaInfo);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getUserReview,
  getAllReviews,
};
