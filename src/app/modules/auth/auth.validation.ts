import { BloodType } from "@prisma/client";
import { z } from "zod";

const registrationValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be string",
  }),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
  bloodType: z.enum(Object.values(BloodType) as [string, ...string[]]),
  location: z.string({
    required_error: "Location is required",
    invalid_type_error: "Location must be string",
  }),
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be number",
  }),
  bio: z.string({
    required_error: "Bio is required",
    invalid_type_error: "Bio must be string",
  }),
  lastDonationDate: z.string({
    required_error: "Last donation date is required",
    invalid_type_error: "Last donation date must be string",
  }),
});

const loginValidationSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be string",
  }),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be string",
  }),
});

export const AuthValidation = {
  registrationValidationSchema,
  loginValidationSchema,
};
