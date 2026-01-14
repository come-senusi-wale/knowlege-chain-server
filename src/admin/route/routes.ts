const express = require("express");
const router = express.Router();

import {
    adminSignUpController,
    adminSignInController
} from './../controller/admin.reg.controller'
import { adminAddTestController, getAllTestController } from "../controller/test.controller";
import { requestValidation } from "./../middleware/request.validation.middleware";
import { checkAdminRole } from "../middleware/role.checker.middleware";
import { getAllUserController } from '../controller/user.controller';

router.post("/registration", requestValidation.validateSignInParams, requestValidation.validateFormData, adminSignUpController ); 
router.post("/login", requestValidation.validateSignInParams, requestValidation.validateFormData, adminSignInController );

router.post("/add-test", checkAdminRole, requestValidation.validateAddTestParams, requestValidation.validateFormData, adminAddTestController );
router.get("/tests", checkAdminRole, getAllTestController );

router.get("/users", checkAdminRole,  getAllUserController );


export default router;