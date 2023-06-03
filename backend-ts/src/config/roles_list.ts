import { findKey } from "lodash"
import { RoleList } from "../types/custom"
import { TargetValue } from "../enums/generalEnums"

// this value will be use in jwt payload to disguise user role
// keys based on enumRole in db schema
export const SHIFTED_ROLES: RoleList = {
  Admin: 6515,
  Employee: 5445,
  Dispatcher: 4578,
  Customer: 2594,
  Guest: 7952,
  Shipper: 3125,
  Supplier: 8254,
}

export const shiftRole = (role: string): number => {
  return SHIFTED_ROLES[role]
}

export const unshiftRole = (shiftedRole: number): string => {
  let result = ""
  Object.entries(SHIFTED_ROLES).find(([key, value]) => {
    if (value === shiftedRole) {
      result = key
      return true
    }
    return false
  })
  return result
}
