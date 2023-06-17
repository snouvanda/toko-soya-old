import { PrismaClient } from "@prisma/client"
import { merge } from "lodash"
import { GotUser } from "types/custom"
import { activeRowCriteria, metaFields } from "./recordConfig"
import {
  UserRole,
  UserApproval,
  LookupField as LF,
  LookupFieldAsync as LFA,
} from "../enums/dbEnums"
import { lookupValAsyncToApp, lookupValToApp } from "./dbLookups"

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

// DB MANIPULATION FUNCTIONS

export const createNewUser = async (values: Record<string, any>) => {
  const {
    email,
    name,
    phone = null,
    requestedRole,
    role,
    isActive,
    regApproval,
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

  console.log("requestedRole → ", requestedRole)
  console.log("role → ", role)

  const user = await prisma.users.create({
    data: {
      email: email,
      name: name,
      phone: phone,
      requestedRole: requestedRole,
      role: role,
      isActive: isActive,
      regApproval: regApproval,
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
    console.log("new user{} → ", user)
    const user_app = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      requestedRole: lookupValToApp(LF.UserRole, user.requestedRole),
      role: lookupValToApp(LF.UserRole, user.role),
      isActive: user.isActive,
      regApproval: lookupValToApp(LF.UserApproval, user.regApproval),
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
    console.log("users {} → ", users)
    let users_app = await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          requestedRole: lookupValToApp(LF.UserRole, user.requestedRole),
          role: lookupValToApp(LF.UserRole, user.role),
          regApproval: lookupValToApp(LF.UserApproval, user.regApproval),
          createdBy: await lookupValAsyncToApp(LFA.User, user.createdBy),
        }
      }),
    )
    console.log("users_app → ", users_app)
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

export const getUserExistanceById = async (id: string) => {
  const user = await prisma.users.findFirst({
    where: merge({ id: id }, activeRowCriteria),
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
        // requestedRole: UserRoleToApp(user.requestedRole),
        requestedRole: lookupValToApp(
          LF.UserRole,
          user.requestedRole,
        ) as unknown as string,
        // role: UserRoleToApp(user.role),
        role: lookupValToApp(LF.UserRole, user.role) as unknown as string,
        isActive: user.isActive,
        // regApproval: UserRoleToApp(user.regApproval),
        regApproval: lookupValToApp(
          LF.UserApproval,
          user.regApproval,
        ) as unknown as string,
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
      // requestedRole: UserRoleToApp(user.requestedRole),
      requestedRole: lookupValToApp(
        LF.UserRole,
        user.requestedRole,
      ) as unknown as string,
      // role: UserRoleToApp(user.role),
      role: lookupValToApp(LF.UserRole, user.role) as unknown as string,
      isActive: user.isActive,
      // regApproval: UserApprovalToApp(user.regApproval),
      regApproval: lookupValToApp(
        LF.UserApproval,
        user.regApproval,
      ) as unknown as string,
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
    let users_app = await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          requestedRole: lookupValToApp(LF.UserRole, user.requestedRole),
          role: lookupValToApp(LF.UserRole, user.role),
          regApproval: lookupValToApp(LF.UserApproval, user.regApproval),
          createdBy: lookupValAsyncToApp(LFA.User, user.createdBy),
        }
      }),
    )
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
    let users_app = await Promise.all(
      users.map((user) => {
        return {
          ...user,
          requestedRole: lookupValToApp(LF.UserRole, user.requestedRole),
          role: lookupValToApp(LF.UserRole, user.role),
          regApproval: lookupValToApp(LF.UserApproval, user.regApproval),
          createdBy: lookupValAsyncToApp(LFA.User, user.createdBy),
        }
      }),
    )
    return users_app
  }
  return {}
}
