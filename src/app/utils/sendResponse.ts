import { Response } from "express";
import TResponse from "../types/response.type";

const sendResponse = <T>(res: Response, data: TResponse<T>): void => {
  const resObj: Omit<TResponse<T>, "meta"> & { meta?: TResponse<T>["meta"] } =
    {
      success: data.success,
      statusCode: data.statusCode,
      message: data.message,
      data: data.data,
    };

  if (data.meta !== undefined) {
    resObj.meta = data.meta;
  }

  res.status(data.statusCode).json(resObj);
};

export default sendResponse;
