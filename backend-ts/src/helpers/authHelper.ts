import crypto from "crypto"
import jwt from "jsonwebtoken"
import { JWTPayload } from "../types/custom"

const accessTokenExpiry: string = "1h"
const refreshTokenExpiry: string = "1h"

export const random = () => crypto.randomBytes(16).toString("hex")

export const hashPassword = (salt: string, password: string) => {
  return crypto.pbkdf2Sync(password, salt, 100, 32, "sha512").toString("hex")
}

export const comparePassword = async (
  password: string,
  salt: string,
  hashedPassword: string,
) => {
  if (hashPassword(salt, password) !== hashedPassword) {
    return false
  }

  return true
}

export const createAccessToken = async (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: accessTokenExpiry,
  })
}

export const createRefresToken = async (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: refreshTokenExpiry,
  })
}

export const decodeAccessToken = async (
  token: string,
): Promise<JWTPayload | any> => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) {
      return null
    }
    return decoded
  })
}

export const decodeRefreshToken = async (
  token: string,
): Promise<JWTPayload | any> => {
  return jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err, decoded) => {
      if (err) {
        return null
      }
      return decoded
    },
  )
}
