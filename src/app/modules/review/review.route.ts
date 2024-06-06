import express from "express";
import auth from "../../middleware/auth";
import { ReviewController } from "./review.controller";

const reviewRouter = express.Router();

reviewRouter.post("/", auth("USER"), ReviewController.createReview);

reviewRouter.get("/all-reviews", ReviewController.getAllReviews);

reviewRouter.get(
  "/",
  auth("USER", "ADMIN", "SUPER_ADMIN"),
  ReviewController.getUserReview
);

export const ReviewRoute = reviewRouter;
