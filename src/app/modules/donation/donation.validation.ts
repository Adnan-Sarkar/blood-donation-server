import { RequestStatus } from "@prisma/client";
import { z } from "zod";

const requestStatus: string[] = [
  RequestStatus.APPROVED,
  RequestStatus.REJECTED,
];

const bloodRequestValidationSchema = z.object({
  donorId: z.string({
    required_error: "Donor ID is required",
    invalid_type_error: "Donor ID must be string",
  }),
  requesterId: z.string({
    required_error: "Requester ID is required",
    invalid_type_error: "Requester ID must be string",
  }),
  phoneNumber: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error: "Phone number must be string",
    })
    .min(10, "Phone number must be at least 10 characters long"),
  dateOfDonation: z.string({
    required_error: "Date of donation is required",
    invalid_type_error: "Date of donation must be string",
  }),
  timeOfDonation: z.string({
    required_error: "Time of donation is required",
    invalid_type_error: "Time of donation must be string",
  }),
  hospitalName: z
    .string({
      required_error: "Hospital name is required",
      invalid_type_error: "Hospital name must be string",
    })
    .min(1, "Hospital name must not be empty"),
  hospitalAddress: z
    .string({
      required_error: "Hospital address is required",
      invalid_type_error: "Hospital address must be string",
    })
    .min(1, "Hospital address must not be empty"),
  reason: z
    .string({
      required_error: "Reason is required",
      invalid_type_error: "Reason must be string",
    })
    .min(1, "Reason must not be empty"),
});

const updateDonationRequestValidationSchema = z.object({
  status: z
    .enum(requestStatus as [string, ...string[]])
    .refine((status) => requestStatus.includes(status), {
      message: "Status must be either APPROVED or REJECTED!",
    }),
});

export const DonationValidation = {
  updateDonationRequestValidationSchema,
  bloodRequestValidationSchema,
};
