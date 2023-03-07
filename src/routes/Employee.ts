import express from "express";
import controller from "../controllers/Employee";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/",
  ValidateSchema(Schemas.employee.validateEmployee),
  controller.createEmployee
);
router.get("/", controller.readAllEmployees);
router.get("/:employeeId", controller.readEmployee);
router.patch(
  "/:employeeId",
  ValidateSchema(Schemas.employee.validateEmployee),
  controller.updateEmployee
);
router.delete("/:employeeId", controller.deleteEmployee);

export = router;