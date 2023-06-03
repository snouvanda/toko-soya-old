import express from "express"
import home from "./homeRouter"
import authentication from "./authRouter"
import users from "./userRouter"
import approval from "./approvalRouter"
import procurement from "./transactions/procurementRouter"

const router = express.Router()

export default (): express.Router => {
  home(router)
  authentication(router)
  users(router)
  approval(router)
  procurement(router)
  return router
}
