import { PrismaClient, Prisma } from "@prisma/client"
import { merge } from "lodash"
import {
  activeRowCriteria,
  deletedRowCriteria,
  metaFields,
} from "./recordConfig"

const prisma = new PrismaClient()

// DB MANIPULATION FUNCTIONS

export const getStockAccountExistanceById = async (accountId: number) => {
  const account = await prisma.stockAccounts.findFirst({
    where: merge({ id: accountId }, activeRowCriteria),
    select: {
      id: true,
      account: true,
    },
  })
  return account
}
