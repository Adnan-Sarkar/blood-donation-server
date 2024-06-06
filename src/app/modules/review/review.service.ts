import TJWTPayload from "../../types/jwtPayload.type";
import TMetaOptions from "../../types/metaOptions";
import prisma from "../../utils/prismaClient";

// create review
const createReview = async (
  user: TJWTPayload,
  payload: { rating: number; comment: string }
) => {
  const result = await prisma.review.create({
    data: {
      userId: user.id,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return result;
};

// get user review
const getUserReview = async (user: TJWTPayload) => {
  const result = await prisma.review.findFirst({
    where: {
      userId: user.id,
    },
  });

  return result;
};

// get all reviews
const getAllReviews = async (metaData: TMetaOptions) => {
  const { limit } = metaData;
  const limitNumber = Number(limit) || 10;

  const result = await prisma.review.findMany({
    where: {
      rating: {
        equals: 5,
      },
    },
    include: {
      user: true,
    },
    take: limitNumber,
  });

  return result;
};

export const ReviewServices = {
  createReview,
  getUserReview,
  getAllReviews,
};
