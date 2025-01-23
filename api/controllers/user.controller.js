import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  // If password is provided, hash it
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Start with the common fields for both students and mentors
  const updateData = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profilePicture: req.body.profilePicture,
    phone: req.body.phone,
    address: req.body.address,
    resumeURL: req.body.resumeURL, 
    expertiseAreas: req.body.expertiseAreas,
    experienceLevel: req.body.experienceLevel,
    availability : req.body.availability,
    linkedin : req.body.linkedin,
    mentorBio : req.body.mentorBio,
    hourlyRate : req.body.hourlyRate,
    companyName : req.body.companyName,
    jobNiche1 : req.body.jobNiche1,
    jobNiche2 : req.body.jobNiche2,
    jobNiche3 : req.body.jobNiche3
  };

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    // Remove password before sending response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  // Assumes user ID is stored in req.user.id (from authentication)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// In user.controller.js







