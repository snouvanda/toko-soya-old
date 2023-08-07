import { PrismaClient } from "@prisma/client";
import { merge } from "lodash";
import { activeRowCriteria } from "@/repositories/recordConfig";

const prisma = new PrismaClient();

// DB MANIPULATION FUNCTIONS

export const getProductExistanceById = async (productId: number) => {
  const product = await prisma.products.findFirst({
    where: merge({ id: productId }, activeRowCriteria),
    select: {
      id: true,
      alias: true,
      name: true,
    },
  });
  return product;
};
