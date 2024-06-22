import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";

// get meta info
const getMetaInfo = async (user: TJWTPayload) => {
  const totalRequestsSent = await prisma.request.count({
    where: {
      requesterId: user.id,
    },
  });

  const totalGettingRequests = await prisma.request.count({
    where: {
      donorId: user.id,
    },
  });

  const totalDonationCompleted = await prisma.request.count({
    where: {
      donorId: user.id,
      iscompleted: true,
    },
  });

  return {
    totalRequestsSent,
    totalGettingRequests,
    totalDonationCompleted,
  };
};

// get admin meta data
const getAdminMetadata = async () => {
  const totalUsers = await prisma.user.count({
    where: {
      role: "USER"
    }
  });

  const totalAvailableActiveUsers = await prisma.user.count({
    where: {
      role: "USER",
      status: "ACTIVE",
      availability: true
    }
  });

  const totalMaleUsers = await prisma.user.count({
    where: {
      role: "USER",
      gender: "MALE"
    }
  });

  const totalCompletedRequests = await prisma.request.count({
    where: {
      iscompleted: true,
    }
  });

  return {
    totalUsers,
    totalAvailableActiveUsers,
    totalMaleUsers,
    totalCompletedRequests
  }
}

export const MetaServices = { getMetaInfo, getAdminMetadata };
