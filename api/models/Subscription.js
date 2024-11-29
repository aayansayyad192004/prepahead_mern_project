import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  planId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  billingCycle: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, default: 'active' }, // Options: active, canceled, expired
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
