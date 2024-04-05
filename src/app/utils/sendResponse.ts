import { Response } from "express";
import TResponse from "../types/response.type";

const sendResponse = <T>(
  res: Response,
  isMetaAvailable: boolean,
  data: TResponse<T>
) => {
  const resObj: Record<string, any> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
  };

  if (isMetaAvailable) {
    resObj.meta = data.meta;
  }

  resObj.data = data.data;

  res.status(data.statusCode).json(resObj);
};

export default sendResponse;
