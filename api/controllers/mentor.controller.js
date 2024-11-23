import User from '../models/user.model.js'; // Use User model instead of Mentor model

// Fetch all mentors
export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }); // Filter by role 'mentor'
    res.status(200).json(mentors); // Return the mentor data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error });
  }
};
