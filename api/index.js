import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import mentorRoutes from './routes/mentor.route.js';
import resultRoutes from './routes/results.route.js';
import studentRoutes from './routes/student.route.js'; 
import cookieParser from 'cookie-parser';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import http from 'http';
import { Server as socketIo } from 'socket.io';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);

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

const interviewSchema = new mongoose.Schema({
  selectedRole: String,
  experience: Number,
  questions: Array,
  userAnswers: Array,
  score: Number,
  timestamp: { type: Date, default: Date.now }
});

const Interview = mongoose.model('Interview', interviewSchema);

// Route to save interview data
app.post('/api/save-interview', async (req, res) => {
  try {
    const { selectedRole, experience, questions, userAnswers, score } = req.body;

    const newInterview = new Interview({
      selectedRole,
      experience,
      questions,
      userAnswers,
      score
    });

    await newInterview.save();
    res.status(200).json({ message: 'Interview data saved successfully' });
  } catch (error) {
    console.error('Error saving interview data:', error);
    res.status(500).json({ error: 'Failed to save interview data' });
  }
});

// Route to get all interview data
app.get('/api/get-interviews', async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching interview data:', error);
    res.status(500).json({ error: 'Failed to fetch interview data' });
  }
});

const io = new socketIo(server, {
  cors: {
    origin: '*',
  },
});

let connectedUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async (messageData) => {
    const { message, userId, mentorId, studentId } = messageData;
  
    try {
      // Ensure that messageData contains valid sender and receiver
      if (!mentorId && !studentId) {
        console.error('Error: Missing mentorId or studentId');
        return;
      }
  
      // Save the message to MongoDB
      const newMessage = new Message({
        sender: userId,
        receiver: mentorId || studentId,
        message,
      });
  
      await newMessage.save(); // Save message to MongoDB
  
      // Find the recipient's socket ID
      const recipient = connectedUsers.find(
        (user) => user.username === mentorId || user.username === studentId
      );
  
      if (recipient) {
        io.to(recipient.socketId).emit('receiveMessage', messageData); // Send message to recipient
      } else {
        console.log('Error: Recipient not connected');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter((user) => user.socketId !== socket.id);
    console.log('A user disconnected');
  });
  
});

app.get('/api/messages', async (req, res) => {
  const { sender, receiver } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Use existing routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api', resultRoutes);
app.use('/api/student', studentRoutes);

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
