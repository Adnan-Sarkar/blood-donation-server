import TJWTPayload from "../../types/jwtPayload.type";
import TMetaOptions from "../../types/metaOptions";
import prisma from "../../utils/prismaClient";

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
    select: {
      id: true,
      userId: true,
      rating: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      user: { select: safeUserSelect },
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
