import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Set __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/jobs', async (req, res) => {
  const { search, location, country } = req.query;

  try {
    const response = await axios.get(`https://serpapi.com/search.json`, {
      params: {
        engine: 'google_jobs',
        q: search,
        location: `${location}, ${country}`,
        api_key: process.env.SERPAPI_API_KEY,
      },
    });

    if (response.data.jobs_results) {
      const jobs = response.data.jobs_results.map((job) => ({
        title: job.title,
        company: job.company_name,
        location: job.location,
        apply_link: job.job_apply_link || job.link,
      }));
      res.json(jobs);
    } else {
      res.status(404).json({ message: 'No jobs found' });
    }
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Fallback for serving client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// 404 route for unmatched API endpoints
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ message: 'API route not found' });
  } else {
    next();
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
