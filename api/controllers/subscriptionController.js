import Subscription from '../models/Subscription.js';
import Razorpay from 'razorpay';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use environment variables directly to create the Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
// Now razorpayInstance is set up and you can continue with payment logic


// Create a subscription
export const createSubscription = async (req, res) => {
  try {
    const { planId, planName, amount, currency, billingCycle, userId } = req.body;

    // Create Razorpay Subscription
    const razorpaySubscription = await razorpayInstance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: billingCycle === 'Every Month' ? 12 : 1, // Set cycles based on billing frequency
    });

    // Save to DB
    const subscription = new Subscription({
      planId,
      userId,
      planName,
      amount,
      currency,
      billingCycle,
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Example for yearly plans
    });

    await subscription.save();

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
      razorpaySubscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error });
  }
};

// Fetch all subscriptions for a user
export const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = await Subscription.find({ userId });

    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};

// Cancel a subscription
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Cancel on Razorpay
    await razorpayInstance.subscriptions.cancel(subscription.planId);

    // Update status in DB
    subscription.status = 'canceled';
    await subscription.save();

    res.status(200).json({ message: 'Subscription canceled successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling subscription', error });
  }
};
