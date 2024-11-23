import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    
    name: { 
      type: String, 
      required: true, 
    },
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
      enum: ['student', 'mentor'], // Only allows 'student' or 'Mentor' roles
      default: 'student', // Sets 'student' as the default role
    },
    jobNiche1: { type: String},
    jobNiche2: { type: String },
    jobNiche3: { type: String},
    expertiseAreas: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    experienceLevel: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    availability: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    linkedin: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    mentorBio: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    hourlyRate: {
      type: Number,
      required: function() { return this.role === 'mentor'; }, // Optional but could be required based on logic
    },
    companyName: {
      type: String,
      required: function() { return this.role === 'mentor'; }, // Required for mentors
    },
    resumeURL: { 
      type: String, 
      // Default can be an empty string or null, depending on whether you want to allow users without a resume
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
