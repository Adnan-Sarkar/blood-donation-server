import TMetaOptions from "../types/metaOptions";

const generatePaginationAndSorting = (
  metaOptions: TMetaOptions,
  sortByFields: string[]
) => {
  const page = Number(metaOptions.page) || 1;
  const limit = Number(metaOptions.limit) || 12;
  const skip = (page - 1) * limit;

  let sortObj = {};
  const sortBy = sortByFields.includes(metaOptions.sortBy as string)
    ? (metaOptions.sortBy as string)
    : "";

  const sortOrder = metaOptions.sortOrder || "asc";

  if (sortBy) {
    sortObj = {
      [sortBy]: sortOrder,
    };
  }

  return {
    page,
    limit,
    skip,
    sortObj,
  };
};

export default generatePaginationAndSorting;
