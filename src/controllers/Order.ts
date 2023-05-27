import { NextFunction, Request, Response } from "express";
import jwtDecode from "jwt-decode";
import mongoose from "mongoose";
import Order from "../models/Order";
import BodyType from "../interfaces/BodyType";
import DecodeTokenType from "../interfaces/DecodeTokenType";
import Employee from "./Employee";

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const {
    address,
    roofPaint,
    roofSize,
    roofAngle,
    lat,
    lng,
    description,
    worker,
  }: BodyType = req.body;

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    address,
    roofPaint,
    roofSize,
    roofAngle,
    lat,
    lng,
    description,
    worker,
  });

  setTimeout(() => {
    return order
      .save()
      .then((order) => res.status(201).json({ order }))
      .catch((error) => res.status(500).json({ error }));
  }, 2000);
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

const readAllOrdersPagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.p) || 0;
  const ordersPerPage = 3;

  try {
    const skip = (page - 1) * ordersPerPage;
    const count = await Order.estimatedDocumentCount();
    const orders = await Order.find().limit(ordersPerPage).skip(skip);
    const pageCount = Math.ceil(count / ordersPerPage);

    res.status(200).json({
      pagination: {
        count,
        pageCount,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const readAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const employeeId = req.query.empId;

  return Order.find({"worker": employeeId})
  .limit(3)
    // .populate("worker")
    // .select("-__v")
    .then((orders) => res.status(200).json({ orders }))
    .catch((error) => res.status(500).json({ error }));
};

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  return Order.findById(orderId)
    .then((order) => {
      if (order) {
        order.set(req.body);

        setTimeout(() => {
          return order
            .save()
            .then((order) => res.status(201).json({ order }))
            .catch((error) => res.status(500).json({ error }));
        }, 2000);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId;

  setTimeout(() => {
    return Order.findByIdAndDelete(orderId).then((order) =>
      order
        ? res.status(201).json({ message: "Order has been removed" })
        : res.status(404).json({ message: "Order not found" })
    );
  }, 2000);
};

const findEmployeeOrdersPagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization!;
  const decode: DecodeTokenType = jwtDecode(token);
  const employeeId = decode.employeeId;

  const page = Number(req.query.p) || 0;
  const ordersPerPage = 3;

  try {
    const skip = (page - 1) * ordersPerPage;
    const allOrders = await Order.find({ worker: `${employeeId}` });
    const orders = await Order.find({ worker: `${employeeId}` })
      .limit(ordersPerPage)
      .skip(skip);
    const count = allOrders.length;
    const pageCount = Math.ceil(count / ordersPerPage);

    res.status(200).json({
      pagination: {
        count,
        pageCount,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const findEmployeeOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization!;
  const decode: DecodeTokenType = jwtDecode(token);
  const employeeId = decode.employeeId;
  Order.find({ worker: `${employeeId}` })
    .populate("worker")
    .select("-__v")
    .then((orders) => res.status(200).json({ orders }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createOrder,
  readOrder,
  readAllOrders,
  readAllOrdersPagination,
  updateOrder,
  deleteOrder,
  findEmployeeOrders,
  findEmployeeOrdersPagination,
};
