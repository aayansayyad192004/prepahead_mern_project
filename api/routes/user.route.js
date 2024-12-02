import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  
} from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser); 
router.get('/api/students', verifyToken, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});
router.post('/add', async (req, res) => {
  const { planName, userId, endDate } = req.body;
  try {
    const subscription = new Subscription({
      planName,
      user: userId,
      endDate,
    });
    await subscription.save();
    res.status(200).json({ message: 'Subscription created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});
export default router;