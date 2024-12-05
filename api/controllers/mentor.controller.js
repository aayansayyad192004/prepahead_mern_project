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

// Fetch a specific mentor by ID
export const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id); // Find mentor by mentorId (id in the URL)
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(200).json(mentor); // Return the mentor data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor information', error });
  }
};