// question.routes.js
import express from 'express';
import { getQuestionsByRole, analyzeAnswer } from '../controllers/question.controller.js';

const router = express.Router();

// Route to get questions by role
router.get('/:role', getQuestionsByRole);

// Route to analyze an answer
router.post('/analyze-answer', analyzeAnswer);

export default router;
