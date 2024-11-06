import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Signup Controller
export const signup = async (req, res, next) => {
  const { username, email, password, phone, address, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body;

  // Ensure Job Seeker provides all niche fields
  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(errorHandler(400, "Please provide your preferred job niches."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    phone,
    address,
    role,
    niches: {
      firstNiche,
      secondNiche,
      thirdNiche,
    },
    coverLetter,
  });

  try {
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully' }); // Success response
  } catch (error) {
    // Handle specific error for duplicate keys
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email or Username already exists.' }); // Duplicate error response
    }
    next(error);
  }
};

// Signin Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour token expiry

    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Signout Controller
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};

// Google OAuth Controller
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // If user exists, generate JWT and respond
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour token expiry

      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      // If user doesn't exist, create a new user with Google info
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
        phone: '', // Optionally handle phone later
        address: '', // Optionally handle address later
        role: 'Job Seeker', // Default role can be changed later
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour token expiry

      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
