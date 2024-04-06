import { ZodError } from "zod";

const zodErrorHandler = (error: ZodError) => {
  let message = "";
  error.issues.forEach((issue) => {
    message += `${issue.message}. `;
  });

  const issues = error.issues.map((issue) => {
    return {
      field: issue.path[0],
      message: issue.message,
    };
  });

  return {
    message,
    issues,
  };
};

export default zodErrorHandler;
