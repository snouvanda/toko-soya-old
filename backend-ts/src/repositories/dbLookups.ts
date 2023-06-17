import {
  CustomerType,
  InventoryLogicalIssuedTo,
  InventoryLogicalReceivedFrom,
  InventoryPhysicalIssuedTo,
  InventoryPhysicalReceivedFrom,
  LookupField as LF,
  LookupFieldAsync as LFA,
  PaymentMethod,
  PaymentStatus,
  ProcurementTrx,
  ShipmentLoadStatus,
  ShippingBillTo,
  StockAdjustmentTrx,
  UserApproval,
  UserRole,
} from "../enums/dbEnums"
import { getProductExistanceById } from "./productsRepo"
import { getStockAccountExistanceById } from "./stockAccountsRepo"
import { getSupplierExistanceById } from "./suppliersRepo"
import { getUserExistanceById } from "./usersRepo"

export const lookupValToApp = (
  lookup: LF,
  value: number | string,
): string | undefined => {
  if (typeof value === "number") {
    switch (lookup) {
      case LF.UserRole:
        return UserRole[value]
        break

      case LF.UserApproval:
        return UserApproval[value]
        break

      case LF.ProcurementTrx:
        return ProcurementTrx[value]
        break

      case LF.ShipmentLoadStatus:
        return ShipmentLoadStatus[value]
        break

      case LF.PaymentStatus:
        return PaymentStatus[value]
        break

      case LF.PaymentMethod:
        return PaymentMethod[value]
        break

      case LF.CustomerType:
        return CustomerType[value]
        break

      case LF.ShippingBillTo:
        return ShippingBillTo[value]
        break

      case LF.StockAdjustmentTrx:
        return StockAdjustmentTrx[value]
        break

      case LF.InventoryLogicalReceivedFrom:
        return InventoryLogicalReceivedFrom[value]
        break

      case LF.InventoryLogicalIssuedTo:
        return InventoryLogicalIssuedTo[value]
        break

      case LF.InventoryPhysicalReceivedFrom:
        return InventoryPhysicalReceivedFrom[value]
        break

      case LF.InventoryPhysicalIssuedTo:
        return InventoryPhysicalIssuedTo[value]
        break

      default:
        return "error"
    }
  }
}

export const lookupValToDB = (
  lookup: LF,
  value: string,
): number | undefined => {
  if (typeof value === "string") {
    switch (lookup) {
      case LF.UserRole:
        const indexOfRole = Object.keys(UserRole).indexOf(value)
        const valueOfRole = Object.values(UserRole)[indexOfRole]
        console.log(`index of ${value}: ${indexOfRole}`)
        console.log(`index value ${valueOfRole}`)
        return valueOfRole as number
        break

      default:
        return 0
        break
    }
  }
}

export const lookupValAsyncToApp = async (
  lookup: LFA,
  value: number | string,
): Promise<string | undefined> => {
  if (typeof value === "number") {
    switch (lookup) {
      case LFA.StockAccount:
        const account = await getStockAccountExistanceById(value)
        if (account) {
          return account.account
        } else return "?"

        break

      case LFA.Product:
        const product = await getProductExistanceById(value)
        if (product) {
          return product.alias
        } else return "?"

        break

      default:
        return "error"
    }
  } else if (typeof value === "string") {
    switch (lookup) {
      case LFA.User:
        const user = await getUserExistanceById(value)
        if (user) {
          return user.email
        } else return "?"
        break

      case LFA.Supplier:
        const supplier = await getSupplierExistanceById(value)
        if (supplier) {
          return supplier.alias
        } else return "?"
        break
    }
  }
}
