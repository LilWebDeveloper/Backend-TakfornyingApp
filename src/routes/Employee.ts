import express from "express";
import controller from "../controllers/Employee";
import extractJWT from "../middleware/ExtractJWT";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/",
  extractJWT,
  ValidateSchema(Schemas.employee.validateEmployee),
  controller.createEmployee
);
router.get("/", extractJWT, controller.readAllEmployeesPagination);
router.get("/all", extractJWT, controller.readAllEmployees);
router.get("/find", extractJWT, controller.findEmployee);
router.get("/:employeeId", extractJWT, controller.readEmployee);
router.patch(
  "/:employeeId",
  extractJWT,
  ValidateSchema(Schemas.employee.updateEmployee),
  controller.updateEmployee
);
router.delete("/:employeeId", extractJWT, controller.deleteEmployee);

export = router;
