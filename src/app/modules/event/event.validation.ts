import { z } from "zod";

const createEventValidationSchema = z.object({
  eventTitle: z
    .string({
      required_error: "Event title is required",
      invalid_type_error: "Event title must be a string",
    })
    .trim()
    .min(1, "Event title must not be empty")
    .max(255, "Event title must not exceed 255 characters"),
  eventLocation: z
    .string({
      required_error: "Event location is required",
      invalid_type_error: "Event location must be a string",
    })
    .trim()
    .min(1, "Event location must not be empty")
    .max(500, "Event location must not exceed 500 characters"),
  eventDate: z
    .string({
      required_error: "Event date is required",
      invalid_type_error: "Event date must be a string",
    })
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "eventDate must be a valid date",
    }),
  eventTime: z
    .string({
      required_error: "Event time is required",
      invalid_type_error: "Event time must be a string",
    })
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "eventTime must be in HH:MM format"),
  contactNumber: z
    .string({
      required_error: "Contact number is required",
      invalid_type_error: "Contact number must be a string",
    })
    .trim()
    .regex(/^\d{10,15}$/, "Contact number must contain 10–15 digits"),
  eventCoverPhoto: z
    .string({ invalid_type_error: "Event cover photo must be a string" })
    .trim()
    .url("Event cover photo must be a valid URL")
    .optional(),
  isComplete: z
    .boolean({ invalid_type_error: "isComplete must be a boolean" })
    .optional(),
});

const updateEventValidationSchema = createEventValidationSchema.partial();

export const EventValidation = {
  createEventValidationSchema,
  updateEventValidationSchema,
};
