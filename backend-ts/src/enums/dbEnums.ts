export enum UserRole {
  Admin = 1,
  Employee = 2,
  Dispatcher = 3,
  Guest = 4,
  Customer = 5,
  Shipper = 6,
  Supplier = 7,
}

export enum UserApproval {
  Pending = 1,
  Approved = 2,
  Denied = 4,
}

export enum ProcurementTrx {
  Beli = 1,
  Pinjam = 2,
}

// export enum StockAccount {
//   FKSMedan = 1,
//   FKSDepo = 2,
//   Toko = 3,
//   RimbunJaya = 4,
//   Aseng = 5,
// }

export enum ShipmentLoadStatus {
  None = 1,
  Partial = 2,
  Full = 3,
  Canceled = 4,
}

export enum PaymentStatus {
  Unpaid = 1,
  Partial = 2,
  Full = 3,
}

export enum PaymentMethod {
  Bank = 1,
  Cash = 2,
  AccReceivable = 3,
  None = 4,
  Composite = 5,
}

export enum CustomerType {
  Producer = 1,
  Reseller = 2,
}

export enum ShippingBillTo {
  Customer = 1,
  Seller = 2,
  Supplier = 3,
}

export enum StockAdjustmentTrx {
  Add = 1,
  Reduce = 2,
}

export enum InventoryLogicalReceivedFrom {
  Procurement = 1,
  SalesReturn = 2,
  StockAdjustment = 3,
}

export enum InventoryLogicalIssuedTo {
  StockAdjustment = 3,
  SalesOrder = 4,
  ProcurementReturn = 5,
}

export enum InventoryPhysicalReceivedFrom {
  Procurement = 1,
  SalesReturn = 2,
  StockAdjustment = 3,
}

export enum InventoryPhysicalIssuedTo {
  StockAdjustment = 3,
  SalesOrder = 4,
  ProcurementReturn = 5,
  Shipments = 6,
}
