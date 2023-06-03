export type JWTPayload = {
  userId: string
  role: number
}

// use in config/role_list
export type RoleList = {
  [key: string]: number
}

export type LookupList = {
  [key: string]: number
}

export interface GotUser {
  id: string
  email: string
  name: string
  phone: string | null
  requestedRole: string
  role: string
  isActive: boolean
  regApproval: string
  createdAt: Date
  createdBy: string
  updatedAt: Date | null
  updatedBy: string | null
}

export interface DbEnumLookupValidation {
  validation: boolean
  dbValue: number
  appValue: string
}

export interface SupplierLookupValidation {
  validation: boolean
  supplierId: string
  alias: string
  companyName: string
}

export interface ProductLookupValidation {
  validation: boolean
  productId: number
  alias: string
  name: string
}

export interface StockAccountLookupValidation {
  validation: boolean
  accountId: number
  account: string
}

export interface ProcurementInput {
  trxDate: string
  supplierId: string
  transaction: number
  productId: number
  quantity: number
  unitPrice: number
  account: number
  loadStatus: number
  paymentStatus: number
  paidAmount: number
  paidMethod: number
  paidAmtBank: number
  paidAmtCash: number
  paidAmtAccRcv: number
  references?: string
  remarks?: string
}
