import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",  // Assuming you have a User model for authentication
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Mentor",  // Assuming you have a Mentor model
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);  // Use 'export default' to resolve the issue
