import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Route to get all students
router.get('/', async (req, res) => {
    try {
      const mentors = await User.find({ role: 'student' });
      res.status(200).json(mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      res.status(500).json({ message: 'Error fetching mentors', error: error.message });
    }
  });



// Get a specific student by ID
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching student with ID: ${id}`);
      const student = await User.findOne({ role: 'student', _id: id });
  
      if (!student) {
        console.log(`Student not found for ID: ${id}`);
        return res.status(404).json({ message: 'Student not found' });
      }
  
      console.log('student found:', student);
      res.status(200).json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
  });



export default router;
