import { BloodType } from "@prisma/client";
import { z } from "zod";

const updateProfileValidationSchema = z.object({
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be number",
    })
    .optional(),
  bio: z
    .string({
      required_error: "Bio is required",
      invalid_type_error: "Bio must be string",
    })
    .optional(),
  lastDonationDate: z
    .string({
      required_error: "Last donation date is required",
      invalid_type_error: "Last donation date must be string",
    })
    .optional(),
});

export const ProfileValidation = {
  updateProfileValidationSchema,
};
