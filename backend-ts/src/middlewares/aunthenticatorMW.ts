import { Request, Response, NextFunction } from "express"
import { decodeAccessToken } from "../helpers/authHelper"

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get accessToken from htttp header
  const authHeader: string | undefined = req.headers.authorization

  const str: string = ""

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401)

  const token = authHeader.split(" ")[1]

  const decoded = await decodeAccessToken(token)

  if (!decoded) return res.sendStatus(403)
  req.jwtPayload = decoded

  console.log("authenticated to")
  console.log(req.jwtPayload)
  next()
}
