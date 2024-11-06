// question.model.js
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: Number,
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      sampleAnswer: { type: String, required: true },
    },
  ],
});

const Question = mongoose.model('Question', QuestionSchema);

export default Question;
