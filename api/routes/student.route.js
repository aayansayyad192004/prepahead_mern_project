import express from 'express';
import { getStudents, getStudentById } from '../controllers/student.controller.js'; // Import the controller functions

const router = express.Router();

// Route to get all students
router.get('/students', getStudents);

// Route to get a specific student by ID
router.get('/students/:id', getStudentById);

export default router;
