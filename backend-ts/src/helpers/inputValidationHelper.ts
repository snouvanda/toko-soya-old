import { merge } from "lodash"
// import { enumRole } from "@prisma/client"
import dra, { setFault } from "./faultMsgHelper" //developer recommended action after error occured.
import {
  DbEnumLookupValidation,
  ProcurementInput,
  ProductLookupValidation,
  StockAccountLookupValidation,
  SupplierLookupValidation,
} from "../types/custom"
import {
  PaymentMethod,
  PaymentStatus,
  ProcurementTrx,
  ShipmentLoadStatus,
  UserRole,
} from "../enums/dbEnums"
import { getSupplierExistanceById } from "../repositories/suppliersRepo"
import { getProductExistanceById } from "../repositories/productsRepo"
import { getStockAccountExistanceById } from "../repositories/stockAccountsRepo"

export const isEmailValid = (email: string) => {
  const EMAIL_REGEX: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  const validEmail = EMAIL_REGEX.test(email)

  if (validEmail) return true
  return false
}

export const isNameValid = (name: string) => {
  if (name.length < 2) {
    return false
  }
  return true
}

export const isRoleValid = async (role: string) => {
  // if (Object.values(enumRole).includes(role as enumRole)) {
  if (role in UserRole) {
    return true
  }

  return false
}

export const isPasswordValid = (password: string) => {
  if (password.length < 8) {
    return false
  }
  return true
}

//
// Return {valid: true} if valid.
//
// If invalid, return:
// {faults:{
//          [faultElement1]:{message: "", msg2Dev: ""},
//          [faultElement2]:{message: "", msg2Dev: ""}
//         }}
//

export const isRegistrationInputsValid = async (
  email: string,
  name: string,
  password: string,
  requestedRole: string,
  phone: string | undefined,
) => {
  let faults = {}
  if (!isEmailValid(email)) {
    merge(faults, {
      email: setFault("Invalid email address", dra.b2_email_entry),
    })
  }

  if (!isNameValid(name)) {
    merge(faults, {
      name: setFault("Name minimum length is 3.", dra.b2_name_entry),
    })
  }

  if (!isPasswordValid(password)) {
    merge(faults, {
      password: setFault(
        "Password minimum length is 8 characters.",
        dra.b2_pwd_entry,
      ),
    })
  }

  if (!(await isRoleValid(requestedRole))) {
    merge(faults, {
      requestedRole: setFault("Role is invalid.", dra.b2_signup_p),
    })
  }

  if (requestedRole !== "guest" && phone === undefined) {
    merge(faults, {
      phone: setFault(
        "Phone is required for requested role. Minimum length is 6 characters",
        dra.b2_signup_p,
      ),
    })
  } else if (requestedRole !== "guest" && phone!.length < 5) {
    merge(faults, {
      phone: setFault("Phone minimum length is 6 characters", dra.b2_signup_p),
    })
  }

  // if has not any fault
  if ((await Object.keys(faults).length) === 0) {
    faults = { valid: true }
    return faults
  }

  // if has any fault
  return { faults }
}

export const isSupplierIdValid = async (
  supplierId: string,
): Promise<SupplierLookupValidation> => {
  const supplier = await getSupplierExistanceById(supplierId)

  if (supplier) {
    return {
      validation: true,
      supplierId: supplier.id,
      alias: supplier.alias,
      companyName: supplier.companyName,
    }
  }
  return {
    validation: false,
    supplierId: "",
    alias: "",
    companyName: "",
  }
}

export const isProductIdValid = async (
  productId: number,
): Promise<ProductLookupValidation> => {
  const product = await getProductExistanceById(productId)

  if (product) {
    return {
      validation: true,
      productId: product.id,
      alias: product.alias,
      name: product.name,
    }
  }
  return {
    validation: false,
    productId: 0,
    alias: "",
    name: "",
  }
}

export const isStockAccountValid = async (
  accountId: number,
): Promise<StockAccountLookupValidation> => {
  const account = await getStockAccountExistanceById(accountId)

  if (account) {
    return {
      validation: true,
      accountId: account.id,
      account: account.account,
    }
  }
  return {
    validation: false,
    accountId: 0,
    account: "",
  }
}

export const isProcurementTrxValid = (
  transaction: number,
): DbEnumLookupValidation => {
  if (transaction in ProcurementTrx) {
    return {
      validation: true,
      dbValue: transaction,
      appValue: ProcurementTrx[transaction],
    }
  }

  // if invalid
  return {
    validation: false,
    dbValue: -1,
    appValue: "",
  }
}

export const isShipmentLoadStatusValid = (
  loadStatus: number,
): DbEnumLookupValidation => {
  if (loadStatus in ShipmentLoadStatus) {
    return {
      validation: true,
      dbValue: loadStatus,
      appValue: ShipmentLoadStatus[loadStatus],
    }
  }

  // if invalid
  return {
    validation: false,
    dbValue: -1,
    appValue: "",
  }
}

export const isPaymentStatusValid = (
  paymentStatus: number,
): DbEnumLookupValidation => {
  if (paymentStatus in PaymentStatus) {
    return {
      validation: true,
      dbValue: paymentStatus,
      appValue: PaymentStatus[paymentStatus],
    }
  }

  // if invalid
  return {
    validation: false,
    dbValue: -1,
    appValue: "",
  }
}

export const isPaidMethodValid = (
  paidMethod: number,
): DbEnumLookupValidation => {
  if (paidMethod in PaymentMethod) {
    return {
      validation: true,
      dbValue: paidMethod,
      appValue: PaymentMethod[paidMethod],
    }
  }

  // if invalid
  return {
    validation: false,
    dbValue: -1,
    appValue: "",
  }
}

export const isNumberInputValid = (value: any) => {
  if (typeof value === "number" && value >= 0) {
    return {
      validation: true,
      value: value,
    }
  }

  // if invalid
  return {
    validation: false,
    value: null,
  }
}

export const isDateInputValid = (date: any) => {
  const DATE_REGEX: RegExp = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/

  const validDate = DATE_REGEX.test(date)

  if (validDate) {
    return {
      validation: true,
      value: date,
    }
  }

  // if invalid
  return {
    validation: false,
    value: null,
  }
}

export const isProcurementInputsValid = async (inputs: ProcurementInput) => {
  // destructure inputs
  const input: ProcurementInput = inputs

  let inputsValidation = { validation: false }
  let invalids: string[] = []
  let validationState: boolean = true

  const validDate = isDateInputValid(input.trxDate)
  console.log("validDate: ", validDate)
  if (!validDate.validation) {
    invalids.push("trxDate")
    validationState = false
  }

  const validSupplier = await isSupplierIdValid(input.supplierId)
  console.log("validSupplier: ", validSupplier)
  if (!validSupplier.validation) {
    invalids.push("supplierId")
    validationState = false
  }

  const validTransaction = isProcurementTrxValid(input.transaction)
  console.log("validTransaction: ", validTransaction)
  if (!validTransaction.validation) {
    invalids.push("transaction")
    validationState = false
  }

  const validProduct = await isProductIdValid(input.productId)
  console.log("validProduct: ", validProduct)
  if (!validProduct.validation) {
    invalids.push("productId")
    validationState = false
  }

  const validQuantity = isNumberInputValid(input.quantity)
  console.log("validQuantity: ", validQuantity)
  if (!validQuantity.validation) {
    invalids.push("quantity")
    validationState = false
  }

  const validUnitPrice = isNumberInputValid(input.unitPrice)
  console.log("validUnitPrice: ", validUnitPrice)
  if (!validUnitPrice.validation) {
    invalids.push("unitPrice")
    validationState = false
  }

  const validAccount = await isStockAccountValid(input.account)
  console.log("validAccount: ", validAccount)
  if (!validAccount.validation) {
    invalids.push("account")
    validationState = false
  }

  const validLoadStatus = isShipmentLoadStatusValid(input.loadStatus)
  console.log("validLoadStatus: ", validLoadStatus)
  if (!validLoadStatus.validation) {
    invalids.push("loadStatus")
    validationState = false
  }

  const validPaymentStatus = isPaymentStatusValid(input.paymentStatus)
  console.log("validPaymentStatus: ", validPaymentStatus)
  if (!validPaymentStatus.validation) {
    invalids.push("paymentStatus")
    validationState = false
  }

  const validPaidAmount = isNumberInputValid(input.paidAmount)
  console.log("validPaidAmount: ", validPaidAmount)
  if (!validPaidAmount.validation) {
    invalids.push("paidAmount")
    validationState = false
  }

  const validPaidMethod = isPaidMethodValid(input.paidMethod)
  console.log("validPaidMethod: ", validPaidMethod)
  if (!validPaidMethod.validation) {
    invalids.push("paidMethod")
    validationState = false
  }

  const validPaidAmtBank = isNumberInputValid(input.paidAmtBank)
  console.log("validPaidAmtBank: ", validPaidAmtBank)
  if (!validPaidAmtBank.validation) {
    invalids.push("paidAmtBank")
    validationState = false
  }

  const validPaidAmtCash = isNumberInputValid(input.paidAmtCash)
  console.log("validPaidAmtCash: ", validPaidAmtCash)
  if (!validPaidAmtCash.validation) {
    invalids.push("paidAmtCash")
    validationState = false
  }

  const validPaidAmtAccRcv = isNumberInputValid(input.paidAmtAccRcv)
  console.log("validPaidAmtAccRcv: ", validPaidAmtAccRcv)
  if (!validPaidAmtAccRcv.validation) {
    invalids.push("paidAmtAccRcv")
    validationState = false
  }

  console.log("invalids: ", invalids)
  console.log("validationState: ", validationState)

  if (validationState) {
    inputsValidation.validation = true
  } else inputsValidation.validation = false

  let finalValidation = merge(inputsValidation, { invalids: invalids })
  return finalValidation
}
