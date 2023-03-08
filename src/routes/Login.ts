import express from "express";
import controller from "../controllers/Employee";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.post("/", controller.login);
router.get("/validate", extractJWT, controller.validateToken);

export = router;
