import express from 'express';
import {
  createSubscription,
  getUserSubscriptions,
  cancelSubscription,
} from '../controllers/subscriptionController.js';

const router = express.Router();

// Route to create a subscription
router.post('/create', createSubscription);

// Route to fetch all subscriptions for a user
router.get('/user/:userId', getUserSubscriptions);

// Route to cancel a subscription
router.delete('/cancel/:subscriptionId', cancelSubscription);

export default router;
