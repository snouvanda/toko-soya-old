import { PrismaClient } from "@prisma/client";
import { merge } from "lodash";
import { activeRowCriteria } from "@/repositories/recordConfig";
import { ProcurementData, GotProcurement } from "@/types/custom";
import { LookupField as LF, LookupFieldAsync as LFA } from "@/enums/dbEnums";
import { lookupValAsyncToApp, lookupValToApp } from "@/repositories/dbLookups";

const prisma = new PrismaClient();

// FIELDS SELECTION

// UTILITY FUNCTIONS

// DB MANIPULATION FUNCTIONS

export const getNewSqc = async (trxDate: string): Promise<number> => {
  const procurements = await prisma.procurements.findMany({
    where: merge({ trxDate: { equals: new Date(trxDate) } }, activeRowCriteria),
    select: { id: true },
  });
  return Object.keys(procurements).length + 1;
};

export const createNewProcurement = async (values: ProcurementData) => {
  const data: ProcurementData = values;

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
      createdAt: true,
      createdBy: true,
      updatedAt: true,
      updatedBy: true,
    },
  });
  if (procurement) {
    const procurement_app = {
      id: procurement.id,
      trxDate: procurement.trxDate,
      sqc: procurement.sqc,
      supplier: {
        id: procurement.supplierId,
        alias: await lookupValAsyncToApp(LFA.Supplier, procurement.supplierId),
      },
      transaction: lookupValToApp(LF.ProcurementTrx, procurement.transaction),
      product: {
        id: procurement.productId,
        alias: await lookupValAsyncToApp(LFA.Product, procurement.productId),
      },
      quantity: procurement.quantity,
      unitPrice: procurement.unitPrice,
      account: {
        id: procurement.account,
        account: await lookupValAsyncToApp(
          LFA.StockAccount,
          procurement.account
        ),
      },
      logicalStock: procurement.logicalStock,
      physicalStock: procurement.physicalStock,
      loadStatus: lookupValToApp(LF.ShipmentLoadStatus, procurement.loadStatus),
      paymentStatus: lookupValToApp(
        LF.PaymentStatus,
        procurement.paymentStatus
      ),
      paidAmount: procurement.paidAmount,
      paidMethod: lookupValToApp(LF.PaymentMethod, procurement.paidMethod),
      paidAmtBank: procurement.paidAmtBank,
      paidAmtCash: procurement.paidAmtCash,
      paidAmtAccRcv: procurement.paidAmtAccRcv,
      references: procurement.references,
      remarks: procurement.remarks,
      createdAt: procurement.createdAt,
      createdBy: {
        userId: procurement.createdBy,
        email: await lookupValAsyncToApp(LFA.User, procurement.createdBy),
      },
    };
    return procurement_app;
  }
  return procurement;
};

export const getProcurements = async (): Promise<GotProcurement[] | {}> => {
  const procurements = await prisma.procurements.findMany({
    where: activeRowCriteria,
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
      createdAt: true,
      createdBy: true,
      updatedAt: true,
      updatedBy: true,
    },
  });

  if (procurements) {
    console.log(">> procurements {} → ", procurements);
    let procurements_app = await Promise.all(
      procurements.map(async (procurement) => {
        return {
          ...procurement,
          supplierId: await lookupValAsyncToApp(
            LFA.Supplier,
            procurement.supplierId
          ),
          transaction: lookupValToApp(
            LF.ProcurementTrx,
            procurement.transaction
          ),
          product: await lookupValAsyncToApp(
            LFA.Product,
            procurement.productId
          ),
          account: await lookupValAsyncToApp(
            LFA.StockAccount,
            procurement.account
          ),
          loadStatus: lookupValToApp(
            LF.ShipmentLoadStatus,
            procurement.loadStatus
          ),
          paymentStatus: lookupValToApp(
            LF.PaymentMethod,
            procurement.paidMethod
          ),
          createdBy: await lookupValAsyncToApp(LFA.User, procurement.createdBy),
        };
      })
    );
    console.log(">> procurements_app → ", procurements_app);
    return procurements_app;
  }
  return {};
};
