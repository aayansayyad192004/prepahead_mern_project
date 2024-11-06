import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import User from './models/user.model.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

app.post('/api/user/update/:id', async (req, res) => {
  console.log('Update route reached'); // Debug log
  const { id } = req.params; // Get user ID from params
  const { phoneNumber, resumeURL } = req.body; // Extract data from body

  try {
      // Find the user and update their details
      const updatedUser = await User.findByIdAndUpdate(id, { phoneNumber, resumeURL }, { new: true });
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser); // Send back updated user data
  } catch (error) {
      console.error('Update error:', error); // Improved error logging
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/user/update/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, phoneNumber, address, resumeURL } = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { username, email, phoneNumber, address, resumeURL },
          { new: true, runValidators: true } // Returns the updated document with validation
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete('/api/user/delete/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      // Your logic to delete the user goes here.
      res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Failed to delete user' });
  }
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});