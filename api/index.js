import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import mentorRoutes from './routes/mentor.route.js';
import subscriptionRoutes from './routes/subscription.route.js';
import Razorpay from 'razorpay';

import cookieParser from 'cookie-parser';
import path from 'path';
import axios from 'axios';
import cors from 'cors';


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const __dirname = path.resolve();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist')));

// Razorpay instance for creating orders
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log(process.env.RAZORPAY_KEY_ID);

// Route to create Razorpay order
app.post('/api/create-order', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // Create the Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise (1 INR = 100 paise)
      currency: currency || 'INR',  // Default currency is INR
      receipt: 'receipt#1',
      notes: {
        key1: 'value1',
        key2: 'value2',
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Send the created order details to the client
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Example route to handle payment success (after user completes payment)
app.post('/api/payment-success', (req, res) => {
  const paymentDetails = req.body; // Contains the payment data received from Razorpay
  
  // You can implement your logic to handle the successful payment here, e.g., storing it in the database
  console.log('Payment Success:', paymentDetails);

  // Respond with success
  res.json({ message: 'Payment successful', paymentDetails });
});

// Example route for handling payment failure (if something goes wrong with the payment)
app.post('/api/payment-failure', (req, res) => {
  const paymentDetails = req.body; // Contains the payment failure data

  // Log or handle payment failure here
  console.log('Payment Failure:', paymentDetails);

  // Respond with failure message
  res.json({ message: 'Payment failed', paymentDetails });
});

// Job search route
app.get('/api/jobs', async (req, res) => {
  const { search, location, country } = req.query;

  try {
    const response = await axios.get(
      `https://serpapi.com/search.json`, 
      {
        params: {
          engine: "google_jobs",
          q: search,
          location: `${location}, ${country}`,
          api_key: process.env.SERPAPI_API_KEY,
        },
      }
    );

    if (response.data.jobs_results) {
      const jobs = response.data.jobs_results.map((job) => ({
        title: job.title,
        company: job.company_name,
        location: job.location,
        apply_link: job.job_apply_link || job.link,
      }));
      res.json(jobs);
    } else {
      res.status(404).json({ message: "No jobs found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// Use existing routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Serve the React client (for production)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
