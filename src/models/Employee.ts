import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee {
  firstName: string;
  secondName: string;
  jobPosition: string;
  dNumber: number;
  login: string;
  password: string;
}

export interface IEmployeeModel extends IEmployee, Document {}

const EmployeeSchema: Schema = new Schema(
  {
    firstName: { type: String, require: true },
    secondName: { type: String, require: true },
    jobPosition: { type: String, require: true },
    dNumber: { type: Number, require: true },
    login: { type: String, require: true },
    password: { type: String, require: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IEmployeeModel>("Employee", EmployeeSchema);
