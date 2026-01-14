import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import TestModel from "../../database/models/test.model";

export const adminAddTestController = async (
    req: Request,
    res: Response,
  ) => {
  
  try {
    const {
      name,
      testUrl,
      spreadsheetUrl
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkTest = await TestModel.findOne({ name });

     // check if user exists
     if (checkTest) {
      return res
        .status(401)
        .json({ message: "Test exists already" });
    }
  
    const test = new TestModel({
      name,
      url: testUrl,
      spreadSheetUrl: spreadsheetUrl
    });
    
    let testSaved = await test.save();
  
    res.json({
      message: "Test added successfully",
      test: {
        id: testSaved._id,
        name: testSaved.name,
      },
  
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
}


export const getAllTestController = async (
  req: Request,
  res: Response,
) => {

  try {
    const {
      page,
      limit,
    } = req.query;
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pageCheck: number = parseInt(page as string) || 1; // or get from query params
    const limitCheck: number = parseInt(limit as string) || 50;
    const skip = (pageCheck - 1) * limitCheck;

    const Questions = await TestModel.find().skip(skip).limit(limitCheck).sort({createdAt: -1})

    const total = await TestModel.countDocuments()
      
    res.json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      Questions

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}