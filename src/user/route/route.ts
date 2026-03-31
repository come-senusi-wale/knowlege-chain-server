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
     uploadImageToIPFS,
     userChangePaymentStatusController,
    userGetAmountController,
    userInitNairaPaymentController,
    userVerifyNairaPaymentController
 } from "./../controller/payment.controller";
import { requestValidation } from "./../middleware/request.validation.middleware";
import { singleFileUpload } from '../../admin/middleware/fileupload.middleware';

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

router.get("/amount", userGetAmountController );

router.post("/upload-image",  singleFileUpload('media', ['image', 'video'], true), uploadImageToIPFS );

export default router;