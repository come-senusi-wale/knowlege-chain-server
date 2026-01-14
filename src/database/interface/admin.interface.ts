import { Document, Types, ObjectId } from "mongoose";

export interface IAdmin extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  passwordOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}