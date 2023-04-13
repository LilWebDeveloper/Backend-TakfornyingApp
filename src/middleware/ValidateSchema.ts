import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import { IEmployee } from "../models/Employee";
import { iOrder } from "../models/Order";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      Logging.error(error);
      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  employee: {
    validateEmployee: Joi.object<IEmployee>({
      firstName: Joi.string().min(3).max(30).required(),
      secondName: Joi.string().min(3).max(30).required(),
      jobPosition: Joi.string().min(3).max(30).required(),
      dNumber: Joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `DNumber / Person Number must have 11 digits.`}).required(),
      login: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(5).max(30).required(),
    }),
    updateEmployee: Joi.object<IEmployee>({
      firstName: Joi.string().min(3).max(30).required(),
      secondName: Joi.string().min(3).max(30).required(),
      jobPosition: Joi.string().min(3).max(30).required(),
      dNumber: Joi.string().regex(/^[0-9]{11}$/).messages({'string.pattern.base': `DNumber / Person Number must have 11 digits.`}).required(),
      login: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(5).required(),
    }),
  },
  order: {
    validateOrder: Joi.object<iOrder>({
      address: Joi.string().min(3).max(50).required(),
      roofPaint: Joi.string().min(3).max(20).required(),
      roofSize: Joi.number().required(),
      roofAngle: Joi.number().max(50).required(),
      lat: Joi.number(),
      lng: Joi.number(),
      description: Joi.string().min(3).required(),
      worker: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
