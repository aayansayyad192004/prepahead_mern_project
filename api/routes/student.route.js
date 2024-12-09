import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Route to fetch all students
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(mentors);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Route to fetch a specific student by ID



export default router;
