import { Request, Response, NextFunction } from "express"

// type RoleSelection = {
//   all?:true
//   admin?: true
//   customer?: true
//   employee?: true
//   guest?: true
//   shipper?: true
//   supplier?: true
// }

export const authorizedTo = (...authorizedRoles: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.jwtPayload) return res.sendStatus(401)

    const { userId, role } = req.jwtPayload

    const rolesArray = [...authorizedRoles]

    const match = rolesArray.includes(role)

    if (!match) return res.sendStatus(401)

    return next()
  }
}
