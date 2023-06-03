import { PrismaClient, Prisma } from "@prisma/client"
import { UserRole, UserApproval } from "../enums/dbEnums"
import { merge } from "lodash"
import { TargetValue } from "../enums/generalEnums"
import { USER_ROLES, USER_APPROVAL } from "./lookup_list"
import { GotUser } from "types/custom"
import {
  activeRowCriteria,
  deletedRowCriteria,
  metaFields,
} from "./recordConfig"

const prisma = new PrismaClient()
const defaultCreator: string = process.env.DEFAULT_CREATOR || "enviro-dv"

// FIELDS SELECTION
const identityFields = {
  id: true,
  email: true,
}

const infoFields = {
  name: true,
  phone: true,
}

const privilegeFields = {
  requestedRole: true,
  role: true,
  isActive: true,
  regApproval: true,
}

const credentialFields = {
  salt: true,
  password: true,
}

// UTILITY FUNCTIONS

const UserRoleToDB = (role: string): number => {
  return USER_ROLES[role]
}

const UserRoleToApp = (role: number): string => {
  let result = ""
  Object.entries(USER_ROLES).find(([key, value]) => {
    if (value === role) {
      result = key
      return true
    }
    return false
  })
  return result
}

const UserApprovalToDB = (approval: string): number => {
  return USER_APPROVAL[approval]
}

const UserApprovalToApp = (approval: number): string => {
  let result = ""
  Object.entries(USER_APPROVAL).find(([key, value]) => {
    if (value === approval) {
      result = key
      return true
    }
    return false
  })
  return result
}

// DB MANIPULATION FUNCTIONS

export const createNewUser = async (values: Record<string, any>) => {
  const {
    email,
    name,
    phone = null,
    requestedRole,
    role,
    isActive,
    salt,
    password,
    createdBy,
  } = values

  let creator: string

  if (!createdBy) {
    creator = defaultCreator
  } else {
    creator = createdBy
  }

  const user = await prisma.users.create({
    data: {
      email: email,
      name: name,
      phone: phone,
      requestedRole: UserRoleToDB(requestedRole),
      role: UserRoleToDB(role),
      isActive: isActive,
      regApproval: UserApproval.Pending,
      salt: salt,
      password: password,
      createdBy: creator,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      requestedRole: true,
      role: true,
      isActive: true,
      regApproval: true,
    },
  })
  if (user) {
    const user_app = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      requestedRole: UserRoleToApp(user.requestedRole),
      role: UserRoleToApp(user.role),
      isActive: user.isActive,
      regApproval: UserApprovalToApp(user.regApproval),
    }
    return user_app
  }
  return user //if no user
}

export const getUsers = async (): Promise<GotUser[] | {}> => {
  const users = await prisma.users.findMany({
    where: activeRowCriteria,
    select: merge(identityFields, infoFields, privilegeFields, metaFields),
  })
  if (users) {
    let users_app = users.map((user) => {
      return {
        ...user,
        requestedRole: UserRoleToApp(user.requestedRole),
        role: UserRoleToApp(user.role),
        regApproval: UserApprovalToApp(user.regApproval),
      }
    })
    return users_app
  }
  return {}
}

export const getUserExistanceByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({
    where: merge({ email: email }, activeRowCriteria),
    select: identityFields,
  })
  return user
}

export const getUserAuthenticationByEmail = async (email: string) => {
  const user = await prisma.users.findFirst({
    where: merge({ email: email }, activeRowCriteria),
    select: merge(identityFields, privilegeFields, credentialFields),
  })
  let user_app = {
    id: "",
    email: "",
    requestedRole: "",
    role: "",
    isActive: false,
    regApproval: "",
    salt: "",
    password: "",
  }
  if (user) {
    if (user.salt) {
      user_app = {
        id: user.id,
        email: user.email,
        requestedRole: UserRoleToApp(user.requestedRole),
        role: UserRoleToApp(user.role),
        isActive: user.isActive,
        regApproval: UserRoleToApp(user.regApproval),
        salt: user.salt,
        password: user.password,
      }
    }
  }
  return user_app
}

export const saveRefreshToken = async (
  refreshToken: string,
  userId: string,
) => {
  const token = await prisma.tokens.create({
    data: { refreshToken, userId },
    select: { refreshToken: true, userId: true },
  })
  return token
}

export const getUserByRefreshToken = async (refreshToken: string) => {
  // find refreshToken in Tokens table
  const foundUser = await prisma.tokens.findUnique({
    where: { refreshToken: refreshToken },
    select: { userId: true, refreshToken: true },
  })

  if (!foundUser) {
    return null
  }

  const user = await prisma.users.findFirst({
    where: merge({ id: foundUser.userId }, activeRowCriteria),
    select: merge(identityFields, privilegeFields),
  })

  // convert role, requestedRole and regApproval (number) into
  // meaning full string value
  let user_app = {
    id: "",
    email: "",
    requestedRole: "",
    role: "",
    isActive: false,
    regApproval: "",
  }
  if (user) {
    user_app = {
      id: user.id,
      email: user.email,
      requestedRole: UserRoleToApp(user.requestedRole),
      role: UserRoleToApp(user.role),
      isActive: user.isActive,
      regApproval: UserApprovalToApp(user.regApproval),
    }
  }
  return user_app
}

// CAUTION!!!
// dELETE = hard delete (delete record from table)
// delete = soft delete (mark as inactive record using isActive field)

// delete all refreshToken of specific userId
export const dELETEAllRefreshToken = async (userId: string) => {
  const tokensDeleted = await prisma.tokens.deleteMany({
    where: { userId: userId },
  })

  return tokensDeleted
}

// delete a refreshToken
export const dELETERefreshToken = async (token: string) => {
  const tokenDeleted = await prisma.tokens.delete({
    where: { refreshToken: token },
  })

  return tokenDeleted
}

export const getUserRegApprovalAllRoles = async (
  status: UserApproval,
): Promise<GotUser[] | {}> => {
  const users = await prisma.users.findMany({
    where: merge({ regApproval: status }, activeRowCriteria),
    select: merge(identityFields, infoFields, privilegeFields, metaFields),
  })
  if (users) {
    let users_app = users.map((user) => {
      return {
        ...user,
        requestedRole: UserRoleToApp(user.requestedRole),
        role: UserRoleToApp(user.role),
        regApproval: UserApprovalToApp(user.regApproval),
      }
    })
    return users_app
  }
  return users
}

export const getUserRegApprovalByRequestedRole = async (
  status: UserApproval,
  requestedRole: UserRole,
): Promise<GotUser[] | {}> => {
  const users = await prisma.users.findMany({
    where: merge({ regApproval: status, requestedRole }, activeRowCriteria),
    select: merge(identityFields, infoFields, privilegeFields, metaFields),
  })
  if (users) {
    let users_app = users.map((user) => {
      return {
        ...user,
        requestedRole: UserRoleToApp(user.requestedRole),
        role: UserRoleToApp(user.role),
        regApproval: UserApprovalToApp(user.regApproval),
      }
    })
    return users_app
  }
  return {}
}
