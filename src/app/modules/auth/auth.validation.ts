import { BloodType, Gender } from "@prisma/client";
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
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
  location: z.string({
    required_error: "Location is required",
    invalid_type_error: "Location must be string",
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

const changePasswordValidationSchema = z.object({
  oldPassword: z.string({
    required_error: "Old Password is required",
    invalid_type_error: "Old Password must be string",
  }),
  newPassword: z.string({
    required_error: "New Password is required",
    invalid_type_error: "New Password must be string",
  }),
});

export const AuthValidation = {
  registrationValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
