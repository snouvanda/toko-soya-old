import { Request, Response } from "express"
import {
  getUserRegApprovalAllRoles,
  getUserRegApprovalByRequestedRole,
} from "../repositories/usersRepo"
// import { enumApproval as Approval, enumRole as Role } from "@prisma/client"
import { UserApproval as Approval, UserRole as Role } from "../enums/dbEnums"

export const getAllRegApprovalRequest = async (req: Request, res: Response) => {
  const users = await getUserRegApprovalAllRoles(Approval.Pending)
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getAdminRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Admin,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getEmployeeRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Employee,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getCustomerRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Customer,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getShipperRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Shipper,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getSupplierRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Supplier,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}

export const getGuestRegApprovalRequest = async (
  req: Request,
  res: Response,
) => {
  const users = await getUserRegApprovalByRequestedRole(
    Approval.Pending,
    Role.Guest,
  )
  if (!users) return res.sendStatus(404)

  return res.status(200).json({ users })
}
