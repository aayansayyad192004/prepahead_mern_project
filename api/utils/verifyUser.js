import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  // Log the received token for debugging
  console.log("Received Token:", token);

  if (!token) {
    console.error("No token provided."); // Log error
    return next(errorHandler(403, 'Access Denied!'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err); // Log error
      return next(errorHandler(403, 'Invalid token!'));
    }
    req.user = user; // Store the verified user info in the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Function to validate email format
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Function to validate phone number format
export const validatePhoneNumber = (phone) => {
  const re = /^\d{10}$/; // Assuming a 10-digit phone number
  return re.test(String(phone));
};
