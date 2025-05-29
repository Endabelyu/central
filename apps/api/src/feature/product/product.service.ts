import { TRPCError } from "@trpc/server";
import prismaClient from "../../libs/prismaClient";

type SortType = "asc" | "desc";

export const getAllProducts = async (
  page: number,
  limit: number,
  q: string,
  sort: SortType,
) => {
  const skip = page > 0 ? (page - 1) * limit : 0;

  const [products, total] = await Promise.all([
    prismaClient.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      include: {
        pricingTiers: true,
      },
      skip,
      take: limit,
      orderBy: {
        name: sort,
      },
    }),
    prismaClient.product.count({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
    }),
  ]);
  if (!products) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Product is unavailable!`,
    });
  }
  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  return prismaClient.product.findUnique({
    where: { slug },
    include: {
      pricingTiers: true,
    },
  });
};
