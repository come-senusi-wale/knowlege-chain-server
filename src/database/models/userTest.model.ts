import { Schema, model } from "mongoose";
import { IUserTest } from "../interface/userTest.interface";

const UserTestSchema = new Schema(
    { 
      user: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true,
      },
      test: {
        type: Schema.Types.ObjectId, ref: 'TestQuestion',
        required: true,
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
  
  const UserTestModel = model<IUserTest>("userTest", UserTestSchema);
  
  export default UserTestModel;