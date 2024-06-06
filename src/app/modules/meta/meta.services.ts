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

export const MetaServices = { getMetaInfo };
