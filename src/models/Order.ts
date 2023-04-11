import mongoose, { Document, Schema } from "mongoose";

export interface iOrder {
  address: string;
  roofPaint: string;
  roofSize: number;
  roofAngle: number;
  lat: string;
  lng: string;
  description: string;
  worker: string;
}

export interface IOrderModel extends iOrder, Document {}

const OrderSchema: Schema = new Schema(
  {
    address: { type: String, require: true },
    roofPaint: { type: String, require: true },
    roofSize: { type: Number, require: true },
    roofAngle: { type: Number, require: true },
    lat: {type: String, require: true},
    lng: {type: String, require: true},
    description: { type: String, require: true },
    worker: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrderModel>("Order", OrderSchema);
