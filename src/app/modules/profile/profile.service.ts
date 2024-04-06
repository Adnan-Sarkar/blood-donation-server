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

export const ProfileService = {
  getMyProfile,
};
