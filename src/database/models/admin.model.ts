import { Schema, model } from "mongoose";
import { IAdmin } from "../interface/admin.interface";

const AdminSchema = new Schema(
    { 
      email: {
        type: String,
      },
      password: {
        type: String,
      },
      passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
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
  
  const AdminModel = model<IAdmin>("Admin", AdminSchema);
  
  export default AdminModel;