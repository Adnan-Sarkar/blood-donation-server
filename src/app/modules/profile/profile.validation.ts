import { z } from "zod";

const updateProfileAndUserDataValidationSchema = z.object({
  user: z
    .object({
      contactNumber: z
        .string({
          invalid_type_error: "Contact Number must be string",
        })
        .optional(),
      location: z
        .string({
          invalid_type_error: "Location must be string",
        })
        .optional(),
      profilePicture: z
        .string({
          invalid_type_error: "Profile Picture must be string",
        })
        .optional(),
      availability: z
        .boolean({
          invalid_type_error: "Availability must be boolean",
        })
        .optional(),
    })
    .optional(),
  userProfile: z
    .object({
      age: z
        .number({
          invalid_type_error: "Age must be number",
        })
        .optional(),
      bio: z
        .string({
          invalid_type_error: "Bio must be string",
        })
        .optional(),
      lastDonationDate: z
        .string({
          invalid_type_error: "Last donation date must be string",
        })
        .optional(),
    })
    .optional(),
});

export const ProfileValidation = {
  updateProfileAndUserDataValidationSchema,
};
