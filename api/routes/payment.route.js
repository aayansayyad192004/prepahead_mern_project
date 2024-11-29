import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const router = express.Router();

// Initialize Razorpay instance with keys from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Example payment route
router.post('/create-order', (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const options = {
    amount: amount * 100, // Convert amount to the smallest unit (paise)
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create order', error: err });
    }
    res.status(200).json(order);
  });
});

export default router;
