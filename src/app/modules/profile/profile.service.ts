import { User, UserProfile } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  contactNumber: true,
  gender: true,
  bloodType: true,
  role: true,
  location: true,
  profilePicture: true,
  status: true,
  availability: true,
  createdAt: true,
  updatedAt: true,
} as const;

// get my profile
const getMyProfile = async (payload: TJWTPayload) => {
  return prisma.user.findUniqueOrThrow({
    where: { id: payload.id },
    select: { ...safeUserSelect, userProfile: true },
  });
};

// get donor profile
const getDonorProfile = async (id: string) => {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: { ...safeUserSelect, userProfile: true },
  });
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

  await prisma.$transaction(async (transactionClient) => {
    if (userInfo) {
      await transactionClient.user.update({
        where: { id: user.id },
        data: userInfo,
      });
    }

    if (userProfile) {
      await transactionClient.userProfile.update({
        where: { userId: user.id },
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
