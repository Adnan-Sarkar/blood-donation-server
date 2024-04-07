import { RequestStatus } from "@prisma/client";
import { z } from "zod";

const requestStatus: string[] = [
  RequestStatus.APPROVED,
  RequestStatus.REJECTED,
];

const updateDonationRequestValidationSchema = z.object({
  status: z
    .enum(requestStatus as [string, ...string[]])
    .refine((status) => requestStatus.includes(status), {
      message: "Status must be either APPROVED or REJECTED!",
    }),
});

export const DonationValidation = {
  updateDonationRequestValidationSchema,
};
