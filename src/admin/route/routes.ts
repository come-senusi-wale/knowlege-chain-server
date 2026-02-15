const express = require("express");
const router = express.Router();

import {
    adminSignUpController,
    adminSignInController
} from './../controller/admin.reg.controller'
import { adminAddTestController, getAllTestController, getTestResultControllerTre, getTestResultControllerTwo } from "../controller/test.controller";
import { requestValidation } from "./../middleware/request.validation.middleware";
import { checkAdminRole } from "../middleware/role.checker.middleware";
import { getAllUserController, getAllUserNotPaidController, getSingleUserController, messageAllUsersController, messageSingleUserController } from '../controller/user.controller';

router.post("/registration", requestValidation.validateSignInParams, requestValidation.validateFormData, adminSignUpController ); 
router.post("/login", requestValidation.validateSignInParams, requestValidation.validateFormData, adminSignInController );

router.post("/add-test", checkAdminRole, requestValidation.validateAddTestParams, requestValidation.validateFormData, adminAddTestController );
router.get("/tests", checkAdminRole, getAllTestController );
router.get("/test/result", checkAdminRole, requestValidation.validateTestResultDetailParams, requestValidation.validateFormData, getTestResultControllerTre );

router.get("/users", checkAdminRole,  getAllUserController );
router.get("/user", checkAdminRole, requestValidation.validateUserDetailParams, requestValidation.validateFormData, getSingleUserController );
router.get("/users-not-paid", checkAdminRole,  getAllUserNotPaidController );
router.post("/message-user", checkAdminRole, requestValidation.validateMessageUserParams, requestValidation.validateFormData, messageSingleUserController );
router.post("/message-users", checkAdminRole, requestValidation.validateMessageUsersParams, requestValidation.validateFormData, messageAllUsersController );


export default router;