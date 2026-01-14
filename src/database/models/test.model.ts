import { Schema, model } from "mongoose";
import { ITestQuestion } from "../interface/test.interface";

const TestQuestionSchema = new Schema(
    { 
      name: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true
      },
      spreadSheetUrl: {
        type: String,
        require: true
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
  
  const TestQuestionModel = model<ITestQuestion>("TestQuestion", TestQuestionSchema);
  
  export default TestQuestionModel;