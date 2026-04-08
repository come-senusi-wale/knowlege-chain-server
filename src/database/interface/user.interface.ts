import { Document, Types, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  walletAddress: string;
  name: string;
  userEmail: string;
  phoneNumber: string;
  emailOtp: {
    otp: string;
    createdTime: Date;
    verified: boolean;
  };
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
}