import express from "express";
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} from "../controllers/paystackcontroller.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.get("/verify", verifyPayment);
router.post("/webhook", express.json({ type: "*/*" }), paystackWebhook);

export default router;
