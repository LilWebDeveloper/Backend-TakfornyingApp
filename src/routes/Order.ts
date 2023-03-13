import express from "express";
import controller from "../controllers/Order";
import extractJWT from "../middleware/extractJWT";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.get("/employee", extractJWT, controller.findEmployeeOrders);
router.post(
  "/",
  extractJWT,
  ValidateSchema(Schemas.order.validateOrder),
  controller.createOrder
);
router.get("/", extractJWT, controller.readAllOrders);
router.get("/:orderId", extractJWT, controller.readOrder);
router.patch(
  "/:orderId",
  extractJWT,
  ValidateSchema(Schemas.order.validateOrder),
  controller.updateOrder
);
router.delete("/:orderId", extractJWT, controller.deleteOrder);

export = router;
