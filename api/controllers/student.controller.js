import User from '../models/user.model.js'; // Use User model to fetch user data

// Fetch all students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }); // Filter by role 'student'
    res.status(200).json(students); // Return the student data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Fetch a specific student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id); // Find student by studentId (id in the URL)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student); // Return the student data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student information', error });
  }
};