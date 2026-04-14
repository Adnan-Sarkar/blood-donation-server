import { z } from "zod";

const createReviewValidationSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment must be a string",
    })
    .trim()
    .min(1, "Comment must not be empty")
    .max(1000, "Comment must not exceed 1000 characters"),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
