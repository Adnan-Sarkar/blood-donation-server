import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

// registration
const registration = catchAsync(async (req, res) => {
  const result = await AuthService.registration(req.body);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Registration successful",
    data: result,
  });
});

// login
const login = catchAsync(async (req, res) => {
  const { refreshToken, result } = await AuthService.login(req.body);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: { result, refreshToken },
  });
});

// get access token using refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const token = await AuthService.refreshToken(refreshToken as string);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access Token retreived successfully",
    data: token,
  });
});

// change password
const changePassword = catchAsync(async (req, res) => {
  const result = await AuthService.changePassword(req.user, req.body);

  sendResponse(res, false, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  registration,
  login,
  changePassword,
  refreshToken,
};
