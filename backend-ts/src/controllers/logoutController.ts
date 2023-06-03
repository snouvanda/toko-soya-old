import { Request, Response } from "express"
import {
  getUserByRefreshToken,
  dELETEAllRefreshToken,
} from "../repositories/usersRepo"
import { cookieStandarOption } from "../config/cookie_option"

export const handleLogout = async (req: Request, res: Response) => {
  console.log("")
  console.log("User try to logout...")
  // notif for client app/FE: also delete accessToken
  // check if cookies exists
  const cookies = req.cookies

  if (!cookies.jwt) {
    return res.sendStatus(204) // No content
  }

  // check if refreshToken exists
  const refreshToken = cookies.jwt
  if (!refreshToken) {
    return res.sendStatus(204)
  } // No content

  // is refreshToken in db?

  const foundUser = await getUserByRefreshToken(refreshToken)

  if (!foundUser) {
    res.clearCookie("jwt", cookieStandarOption)

    return res.sendStatus(204)
  }

  // delete refreshToken in db
  const deletedTokens = await dELETEAllRefreshToken(foundUser!.id)
  console.log("deleted tokens:", deletedTokens)

  // clear cookie
  res.clearCookie("jwt", cookieStandarOption)

  console.log(`User ${foundUser?.email} logged out`) //LOG
  return res.sendStatus(204) // No content
}
