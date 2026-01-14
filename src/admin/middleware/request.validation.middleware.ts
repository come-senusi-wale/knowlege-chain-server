import { body, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateFormData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

export const validateSignInParams = [
  body("email").isEmail(),
  body("password").isString(),
];

export const validateAddTestParams = [
  body("name").isString(),
  body("testUrl").isString(),
  body("spreadsheetUrl").isString(),
];


export const requestValidation = {
  validateFormData,
  validateSignInParams,
  validateAddTestParams,
}