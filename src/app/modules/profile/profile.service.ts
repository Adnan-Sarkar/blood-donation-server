import { User, UserProfile } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";

// get my profile
const getMyProfile = async (payload: TJWTPayload) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
    },
    include: {
      userProfile: true,
    },
  });

  return result;
};

// get donor profile
const getDonorProfile = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      userProfile: true,
    },
  });

  return result;
};

// update my profile and user data
const updateMyUserAndProfileData = async (
  payload: {
    user: Partial<User>;
    userProfile: Partial<UserProfile>;
  },
  user: TJWTPayload
) => {
  const { user: userInfo, userProfile } = payload;

  let needUpdateUserInfo = false;
  let needUpdateUserProfileInfo = false;

  if (userInfo) {
    needUpdateUserInfo = true;
  }
  if (userProfile) {
    needUpdateUserProfileInfo = true;
  }

  await prisma.$transaction(async (transactionClient) => {
    if (needUpdateUserInfo) {
      await transactionClient.user.update({
        where: {
          id: user.id,
        },
        data: userInfo,
      });
    }

    if (needUpdateUserProfileInfo) {
      await transactionClient.userProfile.update({
        where: {
          userId: user.id,
        },
        data: userProfile,
      });
    }
  });

  return null;
};

export const ProfileService = {
  getMyProfile,
  updateMyUserAndProfileData,
  getDonorProfile,
};
