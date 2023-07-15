import { Request, Response } from "express";
import { isProcurementInputsValid } from "../../helpers/inputValidationHelper";
import { ProcurementInput } from "../../types/custom";
import {
  createNewProcurement,
  getNewSqc,
  getProcurements,
} from "../../repositories/procurementsRepo";

export const createProcurement = async (req: Request, res: Response) => {
  console.log("");
  console.log("User try to create a new procurement.");
  try {
    // Prepare inputs
    const inputs: ProcurementInput = req.body;

    const { userId, role } = req.jwtPayload;
    console.log("userId: ", userId);
    console.log("role: ", role);

    // Check if inputs are available
    console.log("Checking inputs ...");
    if (
      !inputs.trxDate ||
      !inputs.supplierId ||
      inputs.transaction == undefined ||
      inputs.productId == undefined ||
      inputs.quantity == undefined ||
      inputs.unitPrice == undefined ||
      inputs.account == undefined ||
      inputs.loadStatus == undefined ||
      inputs.paymentStatus == undefined ||
      inputs.paidAmount == undefined ||
      inputs.paidMethod == undefined ||
      inputs.paidAmtBank == undefined ||
      inputs.paidAmtCash == undefined ||
      inputs.paidAmtAccRcv == undefined
    ) {
      return res
        .status(400)
        .json({ message: "All mandatory fields are required" });
    }
    console.log("Inputs available.");
    console.log(req.body);

    // Validate inputs value
    console.log("validating inputs ...");
    const validInputs = await isProcurementInputsValid(inputs);
    console.log("validInputs: ", validInputs);
    if (!validInputs.validation) {
      console.log("input is invalid.");
      return res.status(400).json(validInputs);
    }
    console.log("input is valid.");

    // Create Procurement
    //-- get new sqc
    const newSqc = await getNewSqc(inputs.trxDate);
    const creator = req.jwtPayload.userId;

    const newProcurement = await createNewProcurement({
      trxDate: inputs.trxDate,
      sqc: newSqc,
      supplierId: inputs.supplierId,
      transaction: inputs.transaction,
      productId: inputs.productId,
      quantity: inputs.quantity,
      unitPrice: inputs.unitPrice,
      account: inputs.account,
      loadStatus: inputs.loadStatus,
      paymentStatus: inputs.paymentStatus,
      paidAmount: inputs.paidAmount,
      paidMethod: inputs.paidMethod,
      paidAmtBank: inputs.paidAmtBank,
      paidAmtCash: inputs.paidAmtCash,
      paidAmtAccRcv: inputs.paidAmtAccRcv,
      references: inputs.references,
      remarks: inputs.remarks,
      createdBy: creator,
    });

    // Return respond
    return res.status(200).json(newProcurement);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllProcurements = async (req: Request, res: Response) => {
  try {
    const procurements = await getProcurements();
    if (!procurements) {
      return res.status(204).json({ message: "No procurements found" });
    }
    return res.json(procurements);
    //
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
