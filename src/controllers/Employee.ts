import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Employee from "../models/Employee";
import bcrypt from 'bcrypt'

const createEmployee = async(req: Request, res: Response, next: NextFunction) => {
  const { firstName, secondName, jobPosition, dNumber, login, password } =
    req.body;

    const passwordHashed = await bcrypt.hash(password, 10)

  const employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    firstName,
    secondName,
    jobPosition,
    dNumber,
    login,
    password: passwordHashed,
  });

  return employee
    .save()
    .then((employee) => res.status(201).json({ employee }))
    .catch((error) => res.status(500).json({ error }));
};

const readEmployee = (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.employeeId;

  return Employee.findById(employeeId)
    .then((employee) =>
      employee
        ? res.status(200).json({ employee })
        : res.status(404).json({ message: "Employee not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const readAllEmployees = (req: Request, res: Response, next: NextFunction) => {
  return Employee.find()
    .then((employees) => res.status(200).json({ employees }))
    .catch((error) => res.status(500).json({ error }));
};

const updateEmployee = (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.employeeId;

  return Employee.findById(employeeId)
    .then((employee) => {
      if (employee) {
        employee.set(req.body);

        return employee
          .save()
          .then((employee) => res.status(201).json({ employee }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.employeeId;

  return Employee.findByIdAndDelete(employeeId).then((employee) =>
    employee
      ? res.status(201).json({ message: "Employee has been removed" })
      : res.status(404).json({ message: "Employee not found" })
  );
};

export default {
  createEmployee,
  readEmployee,
  readAllEmployees,
  updateEmployee,
  deleteEmployee,
};
