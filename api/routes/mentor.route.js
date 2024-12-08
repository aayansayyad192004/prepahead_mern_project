import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Route to fetch all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' });
    res.status(200).json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
});

// Route to fetch a specific mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching mentor with ID: ${id}`);
    const mentor = await User.findOne({ role: 'mentor', _id: id });

    if (!mentor) {
      console.log(`Mentor not found for ID: ${id}`);
      return res.status(404).json({ message: 'Mentor not found' });
    }

    console.log('Mentor found:', mentor);
    res.status(200).json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ message: 'Error fetching mentor', error: error.message });
  }
});

export default router;
