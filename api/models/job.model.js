import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  job_title: String,
  company: String,
  location: String,
  description: String,
  link: String,
  date_posted: String,
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
