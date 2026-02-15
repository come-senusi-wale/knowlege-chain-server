import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

export const validateCreateAccountParams = [
  body("walletAddress").notEmpty(),
];

export const validateCheckWalletParams = [
  query("walletAddress").notEmpty(),
];

export const validateProfileParams = [
  body("walletAddress").notEmpty(),
  body("email").isEmail(),
  body("name").notEmpty(),
  body("phoneNumber").notEmpty(),
];

export const validateVerifyEmailParams = [
  body("email").isEmail(),
  body("otp").notEmpty(),
];

export const validateCheckEmailParams = [
  query("walletAddress").notEmpty(),
];

export const validateInitPaymentParams = [
  body("walletAddress").notEmpty(),
  body("callback").notEmpty(),
];

export const validateVerifyPaymentParams = [
  body("walletAddress").notEmpty(),
  body("reference").notEmpty(),
   body("img").notEmpty(),
];


export const requestValidation = {
  validateFormData,
  validateCreateAccountParams,
  validateCheckWalletParams,
  validateProfileParams,
  validateVerifyEmailParams,
  validateCheckEmailParams,
  validateInitPaymentParams,
  validateVerifyPaymentParams
}