import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/payment.model.js';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
    try {
        const { amount, mentorId } = req.body;

        if (!amount || !mentorId) {
            return res.status(400).json({ error: "Amount and Mentor ID are required" });
        }

        const options = {
            amount: amount * 100, // Amount in paisa (Razorpay expects the amount in paise)
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await razorpayInstance.orders.create(options);

        // Save payment data in the database
        const payment = new Payment({
            userId: req.user.id,
            mentorId,
            orderId: order.id,
            amount: options.amount,
            status: "pending",  // Initial payment status
        });

        await payment.save();

        res.json({
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;

        // Generate the Razorpay signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(order_id + "|" + payment_id)
            .digest("hex");

        if (generatedSignature === signature) {
            // Update payment status to 'paid' in the database
            await Payment.updateOne({ orderId: order_id }, { status: "paid" });
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
