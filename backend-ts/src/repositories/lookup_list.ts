import { LookupList } from "../types/custom"

// DO NOT CHANGE THIS. it uses to save roles to db valid values
export const USER_ROLES: LookupList = {
  Admin: 1,
  Employee: 2,
  Dispatcher: 3,
  Guest: 4,
  Customer: 5,
  Shipper: 6,
  Supplier: 7,
}

export const USER_APPROVAL: LookupList = {
  Pending: 0,
  Approved: 1,
  Denied: 4,
}
