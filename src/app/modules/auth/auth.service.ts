import httpStatus from "http-status";
import { config } from "../../config";
import AppError from "../../error/AppError";
import prisma from "../../utils/prismaClient";
import { TLogin, TRegistration } from "./auth.types";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../utils/jwtHelpers";
import TJWTPayload from "../../types/jwtPayload.type";

// registration
const registration = async (payload: TRegistration) => {
  const { name, email, password, bloodType, gender, location, role } = payload;

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.SALT_ROUNDS)
  );

  const userData: Record<string, any> = {
    name,
    email,
    password: hashedPassword,
    bloodType,
    location,
    gender,
  };

  if (role) {
    userData["role"] = role;
  }

  const result = await prisma.$transaction(async (transaction) => {
    // create user
    const userCreatedData = await transaction.user.create({
      data: userData as TRegistration,
    });

    // create user profile
    await transaction.userProfile.create({
      data: {
        userId: userCreatedData.id,
        bio: "",
        age: 0,
        lastDonationDate: "",
      },
    });

    return await transaction.user.findUniqueOrThrow({
      where: {
        id: userCreatedData.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        location: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        userProfile: true,
      },
    });
  });

  return result;
};

// login
const login = async (payload: TLogin) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });

  const passwordMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!passwordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }

  // generate access token
  const token = jwtHelpers.generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );

  // generate refresh token
  const refreshToken = jwtHelpers.generateToken(
    userData,
    config.JWT_REFRESH_SECRET as string,
    config.JWT_REFRESH_EXPIRES_IN as string
  );

  return {
    result: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token,
    },
    refreshToken,
  };
};

// get access token using refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.JWT_REFRESH_SECRET as string
    ) as TJWTPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: decodedData.id,
      email: decodedData.email,
    },
  });

  // generate access token
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );

  return accessToken;
};

// change password
const changePassword = async (
  user: TJWTPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
      email: user.email,
    },
  });

  const passwordMatched = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!passwordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old Password is incorrect!");
  }

  // hash password
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.SALT_ROUNDS)
  );

  await prisma.user.update({
    where: {
      id: user.id,
      email: user.email,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return null;
};

export const AuthService = {
  registration,
  login,
  changePassword,
  refreshToken,
};
