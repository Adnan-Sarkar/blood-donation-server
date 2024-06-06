import { Prisma, Status } from "@prisma/client";
import TMetaOptions from "../../types/metaOptions";
import generatePaginationAndSorting from "../../utils/generatePaginationAndSorting";
import generatePrismaWhereConditions from "../../utils/generatePrismaWhereConditions";
import prisma from "../../utils/prismaClient";
import { donorListSortByFields } from "../donation/donation.constant";
import { TDonorListQueryParam } from "../donation/donation.type";

// get all users
const getAllUsers = async (
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

// change user status
const changeUserStatus = async (id: string, payload: { status: Status }) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      status: payload.status,
    },
  });

  return null;
};

export const UserService = {
  getAllUsers,
  changeUserStatus,
};
