import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: String,
  experience: Number,
  score: Number,
  answers: [String], // You may change this based on the format of your answers
  date: { type: Date, default: Date.now },
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
