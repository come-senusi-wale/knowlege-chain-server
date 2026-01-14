const express = require("express");
const router = express.Router();

import {
    userCreateAccountController, 
    checkUserWalletAddressController,
    userProvideEmailController,
    userVerifyEmailController,
    checkUserEmailVerifiedController
} from './../controller/user.registration.controller'
import { 
    userGetTestLinkController,
    userRequestForTestQuestionController,
    checkIfUserHasTestLinkController
 } from "./../controller/test.registration.controller";
 import {  
     userChangePaymentStatusController,
    userInitNairaPaymentController,
    userVerifyNairaPaymentController
 } from "./../controller/payment.controller";
import { requestValidation } from "./../middleware/request.validation.middleware";

router.post("/create-account", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, userCreateAccountController ); 
router.get("/check-wallet", requestValidation.validateCheckWalletParams, requestValidation.validateFormData, checkUserWalletAddressController );
router.post("/create-profile", requestValidation.validateProfileParams, requestValidation.validateFormData, userProvideEmailController );
router.post("/verify-email", requestValidation.validateVerifyEmailParams, requestValidation.validateFormData, userVerifyEmailController );
router.get("/check-email", requestValidation.validateCheckEmailParams, requestValidation.validateFormData, checkUserEmailVerifiedController );

router.post("/request-test-question", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, userRequestForTestQuestionController ); 
router.get("/test-link", requestValidation.validateCheckWalletParams, requestValidation.validateFormData, userGetTestLinkController );
router.get("/check-test-link", requestValidation.validateCheckWalletParams, requestValidation.validateFormData, checkIfUserHasTestLinkController );

router.post("/init-payment", requestValidation.validateInitPaymentParams, requestValidation.validateFormData, userInitNairaPaymentController );
router.post("/verify-payment", requestValidation.validateVerifyPaymentParams, requestValidation.validateFormData, userVerifyNairaPaymentController );
router.post("/change-payment-status", requestValidation.validateCreateAccountParams, requestValidation.validateFormData, userChangePaymentStatusController );

export default router;