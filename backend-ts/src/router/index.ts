import express from "express";
import home from "@/router/homeRouter";
import authentication from "@/router/authRouter";
import users from "@/router/userRouter";
import approval from "@/router/approvalRouter";
import procurement from "@/router/transactions/procurementRouter";

const router = express.Router();

export default (): express.Router => {
  home(router);
  authentication(router);
  users(router);
  approval(router);
  procurement(router);
  return router;
};
