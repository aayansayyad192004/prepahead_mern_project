import express from 'express';
import { getMentors,getMentorById } from '../controllers/mentor.controller.js'; // Fetch mentors from User model

const router = express.Router();

// Route to fetch all mentors
router.get('/', getMentors);
router.get('/mentors/:id', getMentorById);
export default router;
