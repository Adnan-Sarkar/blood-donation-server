import { RequestStatus } from "@prisma/client";
import { z } from "zod";

const bloodRequestValidationSchema = z.object({
  donorId: z
    .string({
      required_error: "Donor ID is required",
      invalid_type_error: "Donor ID must be string",
    })
    .trim(),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be string",
    })
    .trim()
    .regex(/^\d{10,15}$/, "Phone number must contain 10–15 digits"),
  dateOfDonation: z
    .string({
      required_error: "Date of donation is required",
      invalid_type_error: "Date of donation must be string",
    })
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "dateOfDonation must be a valid date",
    }),
  timeOfDonation: z
    .string({
      required_error: "Time of donation is required",
      invalid_type_error: "Time of donation must be string",
    })
    .trim()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "timeOfDonation must be in HH:MM format"
    ),
  hospitalName: z
    .string({
      required_error: "Hospital name is required",
      invalid_type_error: "Hospital name must be string",
    })
    .trim()
    .min(1, "Hospital name must not be empty")
    .max(255, "Hospital name must not exceed 255 characters"),
  hospitalAddress: z
    .string({
      required_error: "Hospital address is required",
      invalid_type_error: "Hospital address must be string",
    })
    .trim()
    .min(1, "Hospital address must not be empty")
    .max(500, "Hospital address must not exceed 500 characters"),
  reason: z
    .string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be string",
    })
    .trim()
    .min(1, "Reason must not be empty")
    .max(1000, "Reason must not exceed 1000 characters"),
});

const updateDonationRequestValidationSchema = z.object({
  status: z.enum([RequestStatus.APPROVED, RequestStatus.REJECTED]),
});

export const DonationValidation = {
  updateDonationRequestValidationSchema,
  bloodRequestValidationSchema,
};
