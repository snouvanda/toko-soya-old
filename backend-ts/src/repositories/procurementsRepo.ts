import { PrismaClient, Prisma } from "@prisma/client"
import { merge } from "lodash"
import {
  activeRowCriteria,
  deletedRowCriteria,
  metaFields,
} from "./recordConfig"
import { ProcurementData, ProcurementInput } from "../types/custom"

const prisma = new PrismaClient()

// FIELDS SELECTION

// DB MANIPULATION FUNCTIONS

export const getNewSqc = async (trxDate: string): Promise<number> => {
  const procurements = await prisma.procurements.findMany({
    where: merge({ trxDate: { equals: new Date(trxDate) } }, activeRowCriteria),
    select: { id: true },
  })
  console.log("procurements:", procurements)
  return Object.keys(procurements).length + 1
}

export const createNewProcurement = async (values: ProcurementData) => {
  const data: ProcurementData = values

  const procurement = await prisma.procurements.create({
    data: {
      trxDate: new Date(data.trxDate),
      sqc: data.sqc,
      supplierId: data.supplierId,
      transaction: data.transaction,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      account: data.account,
      logicalStock: data.quantity,
      physicalStock: data.quantity,
      loadStatus: data.loadStatus,
      paymentStatus: data.paymentStatus,
      paidAmount: data.paidAmount,
      paidMethod: data.paidMethod,
      paidAmtBank: data.paidAmtBank,
      paidAmtCash: data.paidAmtCash,
      paidAmtAccRcv: data.paidAmtAccRcv,
      references: data.references,
      remarks: data.remarks,
      createdBy: data.createdBy,
    },
    select: {
      id: true,
      trxDate: true,
      sqc: true,
      supplierId: true,
      transaction: true,
      productId: true,
      quantity: true,
      unitPrice: true,
      account: true,
      logicalStock: true,
      physicalStock: true,
      loadStatus: true,
      paymentStatus: true,
      paidAmount: true,
      paidMethod: true,
      paidAmtBank: true,
      paidAmtCash: true,
      paidAmtAccRcv: true,
      references: true,
      remarks: true,
      createdBy: true,
      createdAt: true,
      updatedBy: true,
      updatedAt: true,
    },
  })
  return procurement
}
