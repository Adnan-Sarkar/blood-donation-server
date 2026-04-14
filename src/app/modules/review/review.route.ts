import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const reviewRouter = express.Router();

reviewRouter.post(
  "/",
  auth("USER"),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview
);

reviewRouter.get("/all-reviews", ReviewController.getAllReviews);

reviewRouter.get(
  "/",
  auth("USER", "ADMIN", "SUPER_ADMIN"),
  ReviewController.getUserReview
);

export const ReviewRoute = reviewRouter;
