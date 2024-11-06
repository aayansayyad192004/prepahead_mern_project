import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create an order in Razorpay
router.post("/create-order", createOrder);

// Route to verify payment after user completes the payment
router.post("/verify-payment", verifyPayment);

export default router;  // Use 'export default' to be consistent with ES Modules
