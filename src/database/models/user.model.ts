import { Schema, model } from "mongoose";
import { IUser } from "../interface/user.interface";

const UserSchema = new Schema(
    { 
      walletAddress: {
        type: String,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
      emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      paid: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    },
    {
      timestamps: true,
    }
  );
  
  const UserModel = model<IUser>("User", UserSchema);
  
  export default UserModel;