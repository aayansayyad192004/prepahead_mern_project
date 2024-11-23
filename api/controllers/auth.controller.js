import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  // Destructure all the necessary fields from the request body
  const { name, username, email, password, phone, address, role, jobNiche1, jobNiche2, jobNiche3, expertiseAreas, experienceLevel, availability, linkedin, mentorBio, hourlyRate, companyName , resumeURL} = req.body;

  // Hash the password using bcryptjs
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    username,
    email,
    password: hashedPassword,
    phone,
    address,
    role, // Set the role ('student' or 'mentor')
    jobNiche1,
    jobNiche2,
    jobNiche3,
    expertiseAreas, // Mentor-specific fields
    experienceLevel,
    availability,
    linkedin,
    mentorBio,
    hourlyRate,
    companyName,
    resumeURL
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle any errors that occur during user creation
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    // Check if the password is valid
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

    // Create a JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Destructure the user document to exclude the password
    const { password: hashedPassword, ...rest } = validUser._doc;

    // Set the token expiration to 1 hour
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    // Send the token and user data in the response
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    // Try to find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // If the user exists, create a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Destructure the user document to exclude the password
      const { password: hashedPassword, ...rest } = user._doc;

      // Set the token expiration to 1 hour
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      // Send the token and user data in the response
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      // If the user doesn't exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
        resumeURL: req.body.resumeURL,
      });

      // Save the new user to the database
      await newUser.save();

      // Create a JWT token for the new user
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      // Destructure the new user document to exclude the password
      const { password: hashedPassword2, ...rest } = newUser._doc;

      // Set the token expiration to 1 hour
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      // Send the token and user data in the response
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};
