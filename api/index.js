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
