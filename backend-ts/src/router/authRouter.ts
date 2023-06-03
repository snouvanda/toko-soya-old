import express from "express"
import { registerUser } from "../controllers/registerController"
import { handleLogin } from "../controllers/loginController"
import { handleLogout } from "../controllers/logoutController"
import { handleRefreshToken } from "../controllers/refreshController"

export default (router: express.Router) => {
  router.post("/auth/register", registerUser)
  router.post("/auth/login", handleLogin)
  router.get("/auth/refresh", handleRefreshToken)
  router.get("/auth/logout", handleLogout)
}
