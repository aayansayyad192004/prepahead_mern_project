import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
    },
    password: { 
      type: String, 
      required: true,
    },
    profilePicture: {
      type: String,
      default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    phone: { 
      type: String, 
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'], // Format validation for phone numbers
    },
    address: { 
      type: String 
    },
    role: { 
      type: String, 
      required: true, 
      enum: ['student', 'Mentor'], // Only allows 'student' or 'Mentor' roles
      default: 'student', // Sets 'student' as the default role
    },
    niches: {
      firstNiche: { type: String }, 
      secondNiche: { type: String },
      thirdNiche: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
