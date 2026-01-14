import { Document, Types, ObjectId } from "mongoose";
import { IUser } from "./user.interface";
import { ITestQuestion } from "./test.interface";

export interface IUserTest extends Document {
  _id: ObjectId;
  user:  IUser['_id'];
  test:  ITestQuestion['_id'];
  createdAt: Date;
  updatedAt: Date;
}