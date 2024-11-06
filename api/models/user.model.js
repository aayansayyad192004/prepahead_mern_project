import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3, // Minimum length validation
    maxlength: 30 // Maximum length validation
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Email format validation
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 // Ensuring a minimum password length for security
  },
  phone: { 
    type: String, 
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'] // Format validation for phone numbers
  },
  address: { type: String },
  role: { 
    type: String, 
    required: true, 
    enum: ['student', 'Recruiter','Mentor'], // Only allows 'user' or 'admin' roles
    default: 'student' // Sets 'user' as the default role
  },
  profilePicture: { type: String },
  niches: {
    firstNiche: { type: String }, 
    secondNiche: { type: String },
    thirdNiche: { type: String },
  },
  coverLetter: { type: String },
}, { timestamps: true });

// Adding indexes for commonly searched fields
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Exporting the User model
export default mongoose.model('User', UserSchema);
