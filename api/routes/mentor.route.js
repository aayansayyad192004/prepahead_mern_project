import express from 'express';
import { getMentors } from '../controllers/mentor.controller.js'; // Fetch mentors from User model

const router = express.Router();

// Route to fetch all mentors
router.get('/', getMentors);

export default router;
