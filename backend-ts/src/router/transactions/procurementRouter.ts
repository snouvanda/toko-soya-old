import express from "express";
import {
  createProcurement,
  getAllProcurements,
} from "../../controllers/transactions/procurementController";
import { isAuthenticated } from "../../middlewares/aunthenticatorMW";
import { authorizedTo } from "../../middlewares/authorizerMW";
import { SHIFTED_ROLES as ROLES } from "../../config/roles_list";

export default (router: express.Router) => {
  router.get(
    "/procurements",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    getAllProcurements
  );
  router.post(
    "/procurements",
    isAuthenticated,
    authorizedTo(ROLES.Admin, ROLES.Employee),
    createProcurement
  );
  // router.patch(
  //   '/procurements',
  //   isAuthenticated,
  //   authorizedTo(ROLES.Admin, ROLES.Employee),
  //   )
  //   router.delete(
  //     '/procurements',
  //     isAuthenticated,
  //     authorizedTo(ROLES.Admin,ROLES.Employee),
  //   )
};
