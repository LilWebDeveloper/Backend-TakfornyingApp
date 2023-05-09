import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Employee from "../models/Employee";
import bcrypt from "bcrypt";
import Logging from "../library/Logging";
import signJWT from "../functions/SignJWT";

const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  Logging.info(`${NAMESPACE} Token Validated, user authorized`);

  return res.status(200).json({
    message: "Authorized",
  });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  let { login } = req.body;

  Employee.find({ login })
    .exec()
    .then((employees) => {
      if (employees.length !== 1) {
        return res.status(401).json({
          message: "Enter your login and password",
          status: 401,
        });
      }

      bcrypt.compare(
        req.body.password,
        employees[0].password,
        (error, result) => {
          if (error) {
            Logging.error(`${NAMESPACE} ${error.message} ${error}`);

            return res.status(401).json({
              message: "Unauthorized",
            });
          } else if (result) {
            signJWT(employees[0], (_error, token) => {
              if (error) {
                Logging.error(`${NAMESPACE} Unable to sign token: ${_error}`);

                return res.status(401).json({
                  message: "Unauthorized",
                  error: _error,
                });
              } else if (token) {
                return res.status(200).json({
                  token,
                  employeeId: employees[0]._id,
                  name: employees[0].login,
                  role: employees[0].jobPosition,
                  status: 200,
                  message: "Authorized",
                });
              }
            });
          } else {
            return res.status(401).json({
              message: "Wrong Password",
              status: 401,
            });
          }
        }
      );
    });
};

const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, secondName, jobPosition, dNumber, login, password } =
    req.body;

  const passwordHashed = await bcrypt.hash(password, 10);

  const employee = new Employee({
    _id: new mongoose.Types.ObjectId().toHexString(),
    firstName,
    secondName,
    jobPosition,
    dNumber,
    login,
    password: passwordHashed,
  });

  setTimeout(() => {
    return employee
      .save()
      .then((employee) => res.status(201).json({ employee }))
      .catch((error) => res.status(500).json({ error }));
  }, 2000);
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

const readAllEmployeesPagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.p) || 0;
  const employeesPerPage = 3;

  try {
    const skip = (page - 1) * employeesPerPage;
    const count = await Employee.estimatedDocumentCount();
    const allEmployees = await Employee.find();
    const employees = await Employee.find().limit(employeesPerPage).skip(skip);
    const pageCount = Math.ceil(count / employeesPerPage);

    res.status(200).json({
      pagination: {
        count,
        pageCount,
      },
      employees,
      allEmployees,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const readAllEmployees = (req: Request, res: Response, next: NextFunction) => {
  return Employee.find()
    .select("-__v")
    .then((employees) => res.status(200).json({ employees }))
    .catch((error) => res.status(500).json({ error }));
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, secondName, jobPosition, dNumber, login, password } =
    req.body;
  const employeeId = req.params.employeeId;

  let passwordHashed = password;

  if (password.trim().length < 30) {
    passwordHashed = await bcrypt.hash(password, 10);
  }

  const updateEmployee = {
    firstName,
    secondName,
    jobPosition,
    dNumber,
    login,
    password: passwordHashed,
  };

  return Employee.findById(employeeId)
    .then((employee) => {
      if (employee) {
        employee.set(updateEmployee);
        setTimeout(() => {
          return employee
            .save()
            .then((employee) => res.status(201).json({ employee }))
            .catch((error) => res.status(500).json({ error }));
        }, 2000);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.params.employeeId;

  setTimeout(() => {
    return Employee.findByIdAndDelete(employeeId).then((employee) =>
      employee
        ? res.status(201).json({ message: "Employee has been removed" })
        : res.status(404).json({ message: "Employee not found" })
    );
  }, 2000);
};

export default {
  login,
  validateToken,
  createEmployee,
  readEmployee,
  readAllEmployees,
  readAllEmployeesPagination,
  updateEmployee,
  deleteEmployee,
};
