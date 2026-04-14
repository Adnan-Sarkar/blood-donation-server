import { Prisma, Request, RequestStatus } from "@prisma/client";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";
import { TDonorListQueryParam } from "./donation.type";
import TMetaOptions from "../../types/metaOptions";
import { donorListSortByFields } from "./donation.constant";
import generatePaginationAndSorting from "../../utils/generatePaginationAndSorting";
import generatePrismaWhereConditions from "../../utils/generatePrismaWhereConditions";
import { JobName, QueueService } from "../queue";

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

// donation request
const donationRequest = async (
  payload: Partial<Request>,
  user: TJWTPayload
) => {
  const donor = await prisma.user.findUniqueOrThrow({
    where: { id: payload.donorId! },
  });

  if (!donor.availability) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Donor is not available for donation."
    );
  }

  const donationRequestData = {
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
    data: donationRequestData,
  });

  void QueueService.enqueueJob(JobName.DONATION_REQUEST_NOTIFICATION, {
    type: JobName.DONATION_REQUEST_NOTIFICATION,
    donorId: donationRequestData.donorId,
    requesterId: user.id,
    requestId: createdRequest.id,
    hospitalName: donationRequestData.hospitalName,
    dateOfDonation: donationRequestData.dateOfDonation as string,
  });

  const requestDetails = await prisma.request.findUniqueOrThrow({
    where: {
      id: createdRequest.id,
    },
    select: {
      id: true,
      donorId: true,
      phoneNumber: true,
      dateOfDonation: true,
      timeOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      iscompleted: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: {
        select: {
          ...safeUserSelect,
          userProfile: true,
        },
      },
    },
  });

  return requestDetails;
};

// get all donation requests
const getAllDonationRequest = async (
  user: TJWTPayload,
  metaData: TMetaOptions
) => {
  const { page, limit, skip } = generatePaginationAndSorting(metaData, []);

  const result = await prisma.request.findMany({
    where: {
      donorId: user.id,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      timeOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      iscompleted: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      requester: { select: safeUserSelect },
    },
    skip,
    take: limit,
  });

  const total = await prisma.request.count({
    where: {
      donorId: user.id,
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// get all my donation requests Me as requester
const getAllMyDonationRequests = async (
  user: TJWTPayload,
  metaData: TMetaOptions
) => {
  const { page, limit, skip } = generatePaginationAndSorting(metaData, []);

  const result = await prisma.request.findMany({
    where: { requesterId: user.id },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      timeOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      iscompleted: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      donor: { select: safeUserSelect },
    },
    skip,
    take: limit,
  });

  const total = await prisma.request.count({
    where: {
      requesterId: user.id,
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// get all my donor request Me as Donor
const getAllMyDonorRequest = async (
  user: TJWTPayload,
  metaData: TMetaOptions
) => {
  const { page, limit, skip } = generatePaginationAndSorting(metaData, []);

  const result = await prisma.request.findMany({
    where: {
      donorId: user.id,
    },
    select: {
      id: true,
      donorId: true,
      requesterId: true,
      phoneNumber: true,
      dateOfDonation: true,
      timeOfDonation: true,
      hospitalName: true,
      hospitalAddress: true,
      reason: true,
      iscompleted: true,
      requestStatus: true,
      createdAt: true,
      updatedAt: true,
      requester: { select: safeUserSelect },
    },
    skip,
    take: limit,
  });

  const total = await prisma.request.count({
    where: {
      donorId: user.id,
    },
  });

  return {
    meta: { page, limit, total },
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

  return !!result;
};

// get donation request status
const getDonationRequestStatus = async (
  donorId: string,
  requesterId: string
): Promise<RequestStatus | null> => {
  const result = await prisma.request.findFirst({
    where: {
      requesterId,
      donorId,
    },
  });

  return result ? result.requestStatus : null;
};

// update donation request status
const updateDonationRequest = async (
  requestId: string,
  user: TJWTPayload,
  payload: { status: RequestStatus }
) => {
  const existingRequest = await prisma.request.findUniqueOrThrow({
    where: {
      id: requestId,
      donorId: user.id,
    },
  });

  if (existingRequest.requestStatus !== RequestStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Request status cannot be changed."
    );
  }

  const result = await prisma.request.update({
    where: {
      id: requestId,
      donorId: user.id,
    },
    data: {
      requestStatus: payload.status,
    },
  });

  void QueueService.enqueueJob(JobName.REQUEST_STATUS_UPDATE, {
    type: JobName.REQUEST_STATUS_UPDATE,
    requestId,
    requesterId: result.requesterId,
    newStatus: payload.status,
  });

  return result;
};

// get donor list
const getDonorList = async (
  query: TDonorListQueryParam,
  metaData: TMetaOptions,
  userId?: string | undefined
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

  let user;
  if (userId) {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  }

  let excludeMe = {};
  if (user && user?.role === "USER") {
    excludeMe = {
      NOT: {
        id: user.id,
      },
    };
  }

  const result = await prisma.user.findMany({
    where: {
      ...whereCondition,
      role: "USER",
      ...excludeMe,
    },
    select: {
      ...safeUserSelect,
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

  if (requestData.requestStatus !== RequestStatus.APPROVED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only approved requests can be marked as complete."
    );
  }

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
