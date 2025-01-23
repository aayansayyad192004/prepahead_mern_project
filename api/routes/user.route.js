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

export default router;