import { Document, Types, ObjectId } from "mongoose";


export interface IAmount extends Document {
  _id: ObjectId;
  amount:  number;
  createdAt: Date;
  updatedAt: Date;
}