import { BloodType, Gender } from "@prisma/client";
import { z } from "zod";

const registrationValidationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be string",
    })
    .trim()
    .min(1, "Name must not be empty"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .trim()
    .email("Email must be a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be string",
    })
    .trim()
    .min(8, "Password must be at least 8 characters"),
  bloodType: z.enum(Object.values(BloodType) as [string, ...string[]]),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
  location: z
    .string({
      required_error: "Location is required",
      invalid_type_error: "Location must be string",
    })
    .trim()
    .min(1, "Location must not be empty"),
});

const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be string",
    })
    .trim()
    .email("Email must be a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be string",
    })
    .trim()
    .min(8, "Password must be at least 8 characters"),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z
    .string({
      required_error: "Old Password is required",
      invalid_type_error: "Old Password must be string",
    })
    .trim()
    .min(8, "Old password must be at least 8 characters"),
  newPassword: z
    .string({
      required_error: "New Password is required",
      invalid_type_error: "New Password must be string",
    })
    .trim()
    .min(8, "New password must be at least 8 characters"),
});

export const AuthValidation = {
  registrationValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
