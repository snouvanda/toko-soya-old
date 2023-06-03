import express from "express"
import { isAuthenticated } from "../middlewares/aunthenticatorMW"
import { authorizedTo } from "../middlewares/authorizerMW"
import { SHIFTED_ROLES as ROLES } from "../config/roles_list"
import {
  getAllRegApprovalRequest,
  getAdminRegApprovalRequest,
  getEmployeeRegApprovalRequest,
  getCustomerRegApprovalRequest,
  getShipperRegApprovalRequest,
  getSupplierRegApprovalRequest,
  getGuestRegApprovalRequest,
} from "../controllers/approvalController"

export default (router: express.Router) => {
  router.get(
    "/reg/approval",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getAllRegApprovalRequest,
  )
  router.get(
    "/reg/approval/admins",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getAdminRegApprovalRequest,
  )
  router.get(
    "/reg/approval/employees",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getEmployeeRegApprovalRequest,
  )
  router.get(
    "/reg/approval/customers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getCustomerRegApprovalRequest,
  )
  router.get(
    "/reg/approval/shippers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getShipperRegApprovalRequest,
  )
  router.get(
    "/reg/approval/suppliers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getSupplierRegApprovalRequest,
  )
  router.get(
    "/reg/approval/guests",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getGuestRegApprovalRequest,
  )

  router.post(
    "/reg/approval",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getAllRegApprovalRequest,
  )
  router.post(
    "/reg/approval/admins",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getAdminRegApprovalRequest,
  )
  router.post(
    "/reg/approval/employees",
    isAuthenticated,
    authorizedTo(ROLES.Admin),
    getEmployeeRegApprovalRequest,
  )
  router.post(
    "/reg/approval/customers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getCustomerRegApprovalRequest,
  )
  router.post(
    "/reg/approval/shippers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getShipperRegApprovalRequest,
  )
  router.post(
    "/reg/approval/suppliers",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getSupplierRegApprovalRequest,
  )
  router.post(
    "/reg/approval/guests",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getGuestRegApprovalRequest,
  )
}
