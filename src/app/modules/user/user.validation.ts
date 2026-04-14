import { z } from "zod";

const changeUserStatusValidationSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be ACTIVE, INACTIVE, or BLOCKED",
  }),
});

export const UserValidation = {
  changeUserStatusValidationSchema,
};
