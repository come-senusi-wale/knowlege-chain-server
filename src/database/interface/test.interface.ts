import { Document, Types, ObjectId } from "mongoose";

export interface ITestQuestion extends Document {
  _id: ObjectId;
  name: string;
  url: string;
  spreadSheetUrl: string;
  createdAt: Date;
  updatedAt: Date;
}