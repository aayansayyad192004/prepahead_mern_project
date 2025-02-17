import express from 'express';
import Result from '../models/result.model.js'; // Model for storing results
const router = express.Router();

// Post route for saving results
router.post('/save-results', async (req, res) => {
  const { role, experience, score, answers ,userId,username} = req.body;

  try {
    const newResult = new Result({
      userId,
      username,
      role,
      experience,
      score,
      answers,
      date: new Date(),
    });

    await newResult.save();
    res.status(201).json({ message: "Results saved successfully!" });
  } catch (error) {
    console.error("Error saving results:", error);
    res.status(500).json({ error: "Failed to save results" });
  }
});

export default router;
