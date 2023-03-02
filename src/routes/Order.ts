import express from "express";
import controller from "../controllers/Order";

const router = express.Router();

router.post("/", controller.createOrder);
router.get("/", controller.readAllOrders);
router.get("/:orderId", controller.readOrder);
router.patch("/:orderId", controller.updateOrder);
router.delete("/:orderId", controller.deleteOrder);

export = router;
