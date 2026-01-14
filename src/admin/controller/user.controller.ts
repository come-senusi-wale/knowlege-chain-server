import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import UserModel from "../../database/models/user.model";

export const getAllUserController = async (
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

    const users = await UserModel.find().skip(skip).limit(limitCheck).sort({createdAt: -1})

    const total = await UserModel.countDocuments()
      
    res.json({
      totalPages: Math.ceil(total / limitCheck),
      currentPage: pageCheck,
      total,
      users

    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}