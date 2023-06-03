import { Request, Response } from "express"
import {
  createAccessToken,
  createRefresToken,
  decodeRefreshToken,
} from "../helpers/authHelper"
import dra, { setFault } from "../helpers/faultMsgHelper" //developer recommended action after error occured.
import {
  dELETERefreshToken,
  dELETEAllRefreshToken,
  getUserByRefreshToken,
  saveRefreshToken,
} from "../repositories/usersRepo"
import { shiftRole } from "../config/roles_list"
import { cookieStandarOption } from "../config/cookie_option"

export const handleRefreshToken = async (req: Request, res: Response) => {
  console.log("")
  console.log("User try to refresh the login")

  // get cookies
  const cookies = req.cookies
  if (!cookies.jwt) {
    return res.sendStatus(401) // No content
  }

  // if refreshToken from cookie available then clear user cookie.jwt
  const refreshToken = cookies.jwt
  res.clearCookie("jwt", cookieStandarOption)

  // is refreshToken in db?
  console.log("finding refreshToken in db ...")
  const foundUser = await getUserByRefreshToken(refreshToken)

  // if refreshToken not found in db, this token might be reused (user hacked)
  if (!foundUser) {
    console.log("> not found in db.")

    // try to get userId from reused token
    const decoded = await decodeRefreshToken(refreshToken)

    // if token can not be decoded then forbid the route
    if (!decoded) return res.sendStatus(403)

    // if token can be decoded then delete all tokens of this userId from db to logout from all devices
    const deletedTokens = await dELETEAllRefreshToken(decoded.id)
    console.log("deleted tokens:", deletedTokens)

    // then forbid the route
    return res.sendStatus(403)
  }

  // if token found in db then verify
  const verified = await decodeRefreshToken(refreshToken)

  // if can not be decoded then this token was tampered
  if (!verified) {
    //delete this refreshToken from db
    const deletedToken = await dELETERefreshToken(refreshToken)
    console.log("deleted token:", deletedToken)
    return res.sendStatus(403)
  }
  // if verified but userId in db not matched with userId in token then forbid the route
  if (verified.userId !== foundUser.id) {
    const deletedToken = await dELETERefreshToken(refreshToken)
    console.log("deleted token:", deletedToken)
    return res.sendStatus(403)
  }

  // token verified and userId matched
  // create new payload with values role from db
  // role is change with number from role_list to disguise role in token
  const payload = {
    userId: foundUser.id,
    role: shiftRole(foundUser.role),
  }

  // create new accessToken and refreshToken
  const newAccessToken = await createAccessToken(payload)
  const newRefreshToken = await createRefresToken(payload)

  // save refreshToken in db
  const savedToken = await saveRefreshToken(newRefreshToken, foundUser.id)
  if (!savedToken) console.log("Failed to save token into db")

  // delete old refreshToken in db
  const deletedToken = await dELETERefreshToken(refreshToken)
  console.log("deleted old token:", deletedToken)
  console.log("")

  // save refreshToken in cookie (jwt)
  const jwtcookie = res.cookie("jwt", newRefreshToken, cookieStandarOption)

  // return accessToken and role string (for client app authorization)
  // role inside accessToken/refreshToken is number not string. But role outside is string
  return res.json({ newAccessToken, role: foundUser.role })
}
