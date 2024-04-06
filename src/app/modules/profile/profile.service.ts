import { UserProfile } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";

// get my profile
const getMyProfile = async (payload: TJWTPayload) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
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

  return result;
};

// update my profile
const updateMyProfile = async (
  payload: Partial<UserProfile>,
  user: TJWTPayload
) => {
  const result = await prisma.userProfile.update({
    where: {
      userId: user.id,
    },
    data: payload,
  });

  return result;
};

export const ProfileService = {
  getMyProfile,
  updateMyProfile,
};
