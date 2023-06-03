import { PrismaClient, Prisma } from "@prisma/client"
import { merge } from "lodash"
import {
  activeRowCriteria,
  deletedRowCriteria,
  metaFields,
} from "./recordConfig"

const prisma = new PrismaClient()

// DB MANIPULATION FUNCTIONS

export const getSupplierExistanceById = async (supplierId: string) => {
  const supplier = await prisma.suppliers.findFirst({
    where: merge({ id: supplierId }, activeRowCriteria),
    select: {
      id: true,
      alias: true,
      companyName: true,
    },
  })
  return supplier
}
