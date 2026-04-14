import { ZodError } from "zod";

const zodErrorHandler = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(". ");

  const issues = error.issues.map((issue) => ({
    field: issue.path[0],
    message: issue.message,
  }));

  return { message, issues };
};

export default zodErrorHandler;
