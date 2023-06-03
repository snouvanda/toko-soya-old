import express from "express"
import { isAuthenticated } from "../middlewares/aunthenticatorMW"
import { authorizedTo } from "../middlewares/authorizerMW"
import { getAllUsers } from "../controllers/usersController"
import { SHIFTED_ROLES as ROLES } from "../config/roles_list"

export default (router: express.Router) => {
  router.get(
    "/users",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee, ROLES.Guest),
    getAllUsers,
  )
}
