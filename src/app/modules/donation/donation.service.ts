import { Request } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";

// donation request
const donationRequest = async (
  payload: Partial<Request>,
  user: TJWTPayload
) => {
  const donationRequest = {
    donorId: payload.donorId,
    requesterId: user.id,
    phoneNumber: payload.phoneNumber,
    dateOfDonation: payload.dateOfDonation,
    hospitalName: payload.hospitalName,
    hospitalAddress: payload.hospitalAddress,
    reason: payload.reason,
  } as Request;

  const createdRequest = await prisma.request.create({
    data: donationRequest,
  });

  const requestDetails = await prisma.request.findUniqueOrThrow({
    where: {
      id: createdRequest.id,
    },
    include: {
      donor: {
        include: {
          userProfile: true,
        },
      },
    },
  });

  const { requesterId, ...result } = requestDetails;

  return result;
};

// get all donation request
const getAllDonationRequest = async (user: TJWTPayload) => {
  const result = await prisma.request.findMany({
    where: {
      donorId: user.id,
    },
    include: {
      requester: true,
    },
  });

  return result;
};

export const DonationService = {
  donationRequest,
  getAllDonationRequest,
};
