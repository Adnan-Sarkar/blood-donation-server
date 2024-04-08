import { Prisma, Request, RequestStatus } from "@prisma/client";
import TJWTPayload from "../../types/jwtPayload.type";
import prisma from "../../utils/prismaClient";
import { TDonorListQueryParam } from "./donation.type";
import TMetaOptions from "../../types/metaOptions";
import {
  donorListSearchFields,
  donorListSortByFields,
} from "./donation.constant";
import generatePaginationAndSorting from "../../utils/generatePaginationAndSorting";

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
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip, sortObj } = generatePaginationAndSorting(
    metaData,
    donorListSortByFields
  );

  let nestedSortObj = {};
  if ("age" in sortObj || "lastDonationDate" in sortObj) {
    nestedSortObj = {
      userProfile: {
        ...sortObj,
      },
    };
  }
  const finalSortObj =
    Object.keys(nestedSortObj).length === 0 ? sortObj : nestedSortObj;

  const conditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    conditions.push({
      OR: donorListSearchFields.map((searchField) => {
        return {
          [searchField]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  const filterFieldsName = Object.keys(filterData);
  if (filterFieldsName.length > 0) {
    conditions.push({
      AND: filterFieldsName.map((filterField) => {
        const equalValue = (filterData as Record<string, any>)[filterField];

        if (equalValue === "true" || equalValue === "false") {
          return {
            [filterField]: {
              equals: equalValue === "true" ? true : false,
            },
          };
        } else {
          return {
            [filterField]: {
              equals: (filterData as Record<string, any>)[filterField],
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.UserWhereInput = {
    AND: conditions,
  };

  const result = await prisma.user.findMany({
    where: whereCondition,
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

export const DonationService = {
  donationRequest,
  getAllDonationRequest,
  updateDonationRequest,
  getDonorList,
};
