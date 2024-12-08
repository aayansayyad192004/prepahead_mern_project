import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Route to fetch all students


// Route to fetch a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findOne({ role: 'student', _id: id }); // Find student by ID

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Send back the student details (including profile picture and email)
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

export default router;
