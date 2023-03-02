import express from "express";
import controller from "../controllers/Order";

const router = express.Router();

router.post("/new", controller.createOrder);
router.get("/", controller.readAllOrders);
router.get("/:orderId", controller.readOrder);
router.patch("/:orderId/edit", controller.updateOrder);
router.delete("/:orderId", controller.deleteOrder);

export = router;
