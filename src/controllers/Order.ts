import { NextFunction, Request, Response } from "express";
import jwtDecode from "jwt-decode";
import mongoose from "mongoose";
import Order from "../models/Order";

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const { address, roofPaint, roofSize, roofAngle, description, worker } =
    req.body;

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    address,
    roofPaint,
    roofSize,
    roofAngle,
    description,
    worker,
  });

  return order
    .save()
    .then((order) => res.status(201).json({ order }))
    .catch((error) => res.status(500).json({ error }));
};

const readOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findById(orderId)
    .populate("worker")
    .select("-__v")
    .then((order) =>
      order
        ? res.status(200).json({ order })
        : res.status(404).json({ message: "Order not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const readAllOrders = (req: Request, res: Response, next: NextFunction) => {
  return Order.find()
    .populate("worker")
    .select("-__v")
    .then((orders) => res.status(200).json({ orders }))
    .catch((error) => res.status(500).json({ error }));
};

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findById(orderId)
    .then((order) => {
      if (order) {
        order.set(req.body);

        return order
          .save()
          .then((order) => res.status(201).json({ order }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findByIdAndDelete(orderId).then((order) =>
    order
      ? res.status(201).json({ message: "Order has been removed" })
      : res.status(404).json({ message: "Order not found" })
  );
};

const findEmployeeOrders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.headers.authorization;
  const decode: any = jwtDecode(token);
  const employeeId = decode.employeeId;

  Order.find({"worker": `${employeeId}`})
    .populate("worker")
    .select("-__v")
    .then((orders) => res.status(200).json({ orders }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createOrder,
  readOrder,
  readAllOrders,
  updateOrder,
  deleteOrder,
  findEmployeeOrders
};
