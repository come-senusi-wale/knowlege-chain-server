import { Schema, model } from "mongoose";
import { IAmount } from "../interface/amount.interface"

const AmountSchema = new Schema(
    { 
      amount: {
        type: Number,
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
  
  const AmountModel = model<IAmount>("Amounts", AmountSchema);
  
  export default AmountModel;