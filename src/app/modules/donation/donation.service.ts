import { Prisma, Request, RequestStatus } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";
import { TDonorListQueryParam } from "./donation.type";
import TMetaOptions from "../../types/metaOptions";
import { donorListSortByFields } from "./donation.constant";
import generatePaginationAndSorting from "../../utils/generatePaginationAndSorting";
import generatePrismaWhereConditions from "../../utils/generatePrismaWhereConditions";

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
    timeOfDonation: payload.timeOfDonation,
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

// get all donation requests
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

// get all my donation requests Me as requester
const getAllMyDonationRequests = async (
  user: TJWTPayload,
  metaData: TMetaOptions
) => {
  const { page, limit } = metaData;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const result = await prisma.request.findMany({
    where: { requesterId: user.id },
    include: {
      donor: true,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  const total = await prisma.request.count({
    where: {
      requesterId: user.id,
    },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

// get all my donor request Me as Donor
const getAllMyDonorRequest = async (
  user: TJWTPayload,
  metaData: TMetaOptions
) => {
  const { page, limit } = metaData;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const result = await prisma.request.findMany({
    where: {
      donorId: user.id,
    },
    include: {
      requester: true,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  const total = await prisma.request.count({
    where: {
      donorId: user.id,
    },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
    data: result,
  };
};

// check donation request is sent or not
const checkDonationRequest = async (donorId: string, requesterId: string) => {
  const result = await prisma.request.findFirst({
    where: {
      requesterId,
      donorId,
    },
  });

  if (result?.id) {
    return true;
  } else {
    return false;
  }
};

// get donation request status
const getDonationRequestStatus = async (
  donorId: string,
  requesterId: string
) => {
  const result = await prisma.request.findFirst({
    where: {
      requesterId,
      donorId,
    },
  });

  if (result?.id) {
    return result.requestStatus;
  } else {
    return false;
  }
};

// update donation request status
const updateDonationRequest = async (
  requestId: string,
  user: TJWTPayload,
  payload: { status: RequestStatus }
) => {
  await prisma.request.findUniqueOrThrow({
    where: {
      id: requestId,
      donorId: user.id,
    },
  });

  const result = await prisma.request.update({
    where: {
      id: requestId,
      donorId: user.id,
    },
    data: {
      requestStatus: payload.status,
    },
  });

  return result;
};

// get donor list
const getDonorList = async (
  query: TDonorListQueryParam,
  metaData: TMetaOptions
) => {
  const { page, limit, skip, sortObj } = generatePaginationAndSorting(
    metaData,
    donorListSortByFields
  );

  const { finalSortObj, conditions } = generatePrismaWhereConditions(
    query,
    sortObj
  );

  const whereCondition: Prisma.UserWhereInput = {
    AND: conditions,
  };

  const result = await prisma.user.findMany({
    where: {
      ...whereCondition,
      role: "USER",
    },
    include: {
      userProfile: true,
    },
    skip,
    take: limit,
    orderBy: finalSortObj,
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// complete request
const completeRequest = async (id: string, user: TJWTPayload) => {
  const requestData = await prisma.request.findUniqueOrThrow({
    where: {
      id,
      donorId: user.id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.request.update({
      where: {
        id,
      },
      data: {
        iscompleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        id: requestData.donorId,
      },
      data: {
        availability: false,
      },
    });

    await transactionClient.userProfile.update({
      where: {
        userId: requestData.donorId,
      },
      data: {
        lastDonationDate: new Date().toISOString().slice(0, 10),
      },
    });
  });

  return null;
};

export const DonationService = {
  donationRequest,
  getAllDonationRequest,
  updateDonationRequest,
  getDonorList,
  getAllMyDonationRequests,
  getAllMyDonorRequest,
  checkDonationRequest,
  getDonationRequestStatus,
  completeRequest,
};
