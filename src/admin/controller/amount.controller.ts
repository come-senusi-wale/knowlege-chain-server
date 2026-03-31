import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import AmountModel from "../../database/models/amount.model";

export const changeAmountController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      amount
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const checkAmount = await AmountModel.findOne()
    if (!checkAmount) {
        await AmountModel.create({amount})
    }else{
        await AmountModel.findOneAndUpdate({}, {amount})
    }
  
    res.json({
      message: "Amount change sucessfully",
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getAmountController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const amount = await AmountModel.findOne()
  
    res.json({
      amount,
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}