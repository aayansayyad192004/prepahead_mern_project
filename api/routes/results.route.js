import express from 'express';
import Result from '../models/result.model.js'; // Model for storing results
const router = express.Router();

// Post route for saving results
// Get all results
router.get('/get-results', async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// Get results by user ID
router.get('/get-results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userResults = await Result.find({ userId });

    if (!userResults.length) {
      return res.status(404).json({ message: "No results found for this user." });
    }

    res.status(200).json(userResults);
  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).json({ error: "Failed to fetch user results" });
  }
});

router.post('/save-results', async (req, res) => {
  const { role, experience, score, answers ,userId,username} = req.body;
  console.log("Received Data:", { userId, username, role, experience, score, answers });

  try {
    const newResult = new Result({
      
      userId, // Add user ID
      username, // Add username
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
