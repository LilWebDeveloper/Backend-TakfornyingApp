import express from "express";
import controller from "../controllers/Order";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";
// import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post(
  "/",
  ValidateSchema(Schemas.order.validateOrder),
  controller.createOrder
);
router.get("/", controller.readAllOrders);
router.get("/:orderId", controller.readOrder);
router.patch(
  "/:orderId",
  ValidateSchema(Schemas.order.validateOrder),
  controller.updateOrder
);
router.delete("/:orderId", controller.deleteOrder);

export = router;
