// question.controller.js
import Question from '../models/question.model.js';

// Controller to fetch questions based on role
export const getQuestionsByRole = async (req, res) => {
  const { role } = req.params;

  try {
    const questions = await Question.find({ role });
    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the specified role.' });
    }
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions from the database' });
  }
};

// Controller to analyze an answer (dummy implementation, replace with actual logic)
export const analyzeAnswer = async (req, res) => {
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ message: 'Answer is required' });
  }

  // Add your answer analysis logic here
  const analysisResult = { score: 85, feedback: 'Good answer!' }; // Example response

  res.status(200).json({ message: 'Answer analyzed successfully', data: analysisResult });
};
