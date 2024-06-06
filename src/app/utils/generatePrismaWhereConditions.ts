import { Prisma } from "@prisma/client";
import { donorListSearchFields } from "../modules/donation/donation.constant";
import { TDonorListQueryParam } from "../modules/donation/donation.type";

const generatePrismaWhereConditions = (
  query: TDonorListQueryParam,
  sortObj: Record<string, any>
): {
  finalSortObj: Record<string, any>;
  conditions: Prisma.UserWhereInput[];
} => {
  const { searchTerm, ...filterData } = query;

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
              equals: equalValue === "true",
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

  return {
    finalSortObj,
    conditions,
  };
};

export default generatePrismaWhereConditions;
