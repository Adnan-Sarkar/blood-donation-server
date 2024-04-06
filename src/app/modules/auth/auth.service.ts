import httpStatus from "http-status";
import { config } from "../../config";
import AppError from "../../error/AppError";
import prisma from "../../utils/prismaClient";
import { TLogin, TRegistration } from "./auth.types";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../utils/jwtHelpers";

// registration
const registration = async (payload: TRegistration) => {
  const {
    name,
    email,
    password,
    bloodType,
    location,
    age,
    bio,
    lastDonationDate,
  } = payload;

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.SALT_ROUNDS)
  );

  const userData = {
    name,
    email,
    password: hashedPassword,
    bloodType,
    location,
  };

  const result = await prisma.$transaction(async (transaction) => {
    // create user
    const userCreatedData = await transaction.user.create({
      data: userData,
    });

    // create user profile
    await transaction.userProfile.create({
      data: {
        userId: userCreatedData.id,
        bio,
        age,
        lastDonationDate,
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
    { id: userData.id, name: userData.name, email: userData.email },
    config.JWT_ACCESS_SECRET as string,
    config.JWT_ACCESS_EXPIRES_IN as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    token,
  };
};

export const AuthService = {
  registration,
  login,
};
