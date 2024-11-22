import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    role: '',
    jobNiche1: '',
    jobNiche2: '',
    jobNiche3: '',
    expertiseAreas: '', // Mentor-specific
    experienceLevel: '', // Mentor-specific
    availability: '', // Mentor-specific
    linkedin: '', // Mentor-specific
    mentorBio: '', // Mentor-specific
    hourlyRate: '', // Mentor-specific (optional)
    companyName: '',
    resumeURL: '', // Mentor-specific
  });

  const [resume, setResume] = useState(null);
  const [resumePercent, setResumePercent] = useState(0);
  const [resumeError, setResumeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    console.log(`${e.target.id}: ${e.target.value}`);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
    handleFileUpload(file); // Add this line to start upload immediately
  };

  const handleFileUpload = async (file) => {
    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, 'resumes/' + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setResumePercent(Math.round(progress));
          },
          (error) => {
            setResumeError(true);
            console.error('Upload error:', error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData((prevData) => ({
                ...prevData,
                resumeURL: downloadURL,
              }));
              resolve(downloadURL);
            });
          }
        );
      });
    } catch (error) {
      console.error('File upload failed:', error);
      setResumeError(true);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError(true);
      return;
    }

    if (formData.role === "mentor" && (!formData.expertiseAreas || !formData.experienceLevel || !formData.availability || !formData.companyName)) {
      setError(true);
      return;
    }

    if (resume) {
      await handleFileUpload(resume);
    }

    
    try {
      setLoading(true);
      setError(false);
      console.log('Form Data:', formData);

      const res = await fetch('/api/auth/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);
      console.log('Response Data:', data);

      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      console.error('Signup error:', error);
      setError(true);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        
        {/* Name Input */}
        <input
          type='text'
          placeholder='Name'
          id='name'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        {/* Username Input */}
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        {/* Email Input */}
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        {/* Password Input */}
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />  

        {/* Phone Number Input */}
        <input
          type='tel'
          id='phone'
          placeholder='Phone'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
          required
        />

        {/* Address Input */}
        <input
          type='text'
          placeholder='Address'
          id='address'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />

        {/* Role Dropdown */}
        <select
          id='role'
          className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        >
          <option value=''>Select Role</option>
          <option value='student'>Student</option>
          <option value='mentor'>Mentor</option>
          <option value='recruiter'>Recruiter</option>
        </select>

        {/* Conditional Fields for Mentor */}
        {formData.role === "mentor" ? (
          <>
            {/* Expertise Areas Input */}
            <input
              type="text"
              id="expertiseAreas"
              placeholder="Expertise Areas (e.g., Web Development, Data Science)"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            {/* Experience Level Input */}
            <input
              type="text"
              id="experienceLevel"
              placeholder="Experience Level (e.g., 5 years)"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            {/* Mentorship Availability Input */}
            <input
              type="text"
              id="availability"
              placeholder="Mentorship Availability (e.g., Weekends)"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            {/* LinkedIn/Portfolio URL Input */}
            <input
              type="url"
              id="linkedin"
              placeholder="LinkedIn Profile URL"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            {/* Mentor Bio Input */}
            <textarea
              id="mentorBio"
              placeholder="Brief Bio"
              className="bg-slate-100 p-3 rounded-lg "
              onChange={handleChange}
            />

            {/* Hourly Rate Input (optional) */}
            <input
              type="number"
              id="hourlyRate"
              placeholder="Hourly Rate (if applicable)"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            {/* Company Name Input */}
            <input
              type="text"
              id="companyName"
              placeholder="Company Name"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            {/* Job Niches (visible only for non-mentors) */}
            <input
              type="text"
              id="jobNiche1"
              placeholder="Job Niche 1"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            <input
              type="text"
              id="jobNiche2"
              placeholder="Job Niche 2"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />

            <input
              type="text"
              id="jobNiche3"
              placeholder="Job Niche 3"
              className="bg-slate-100 p-3 rounded-lg"
              onChange={handleChange}
            />
             
             {/* Resume Upload Field */}
             <div>
          <label htmlFor="resume" className="block text-gray-700">
            Upload Resume
          </label>
          <input
            type="file"
            id="resumeURL"
            accept=".pdf,.doc,.docx"
            className="w-full bg-gray-100 rounded-lg p-3 border border-gray-200"
            onChange={handleResumeChange}
            required
          />
          {resumePercent > 0 && resumePercent < 100 && (
            <div className="text-gray-600">{`Uploading resume: ${resumePercent}%`}</div>
          )}
          {resumePercent === 100 && !resumeError && (
            <div className="text-green-600">Resume uploaded successfully!</div>
          )}
          {resumeError && (
            <div className="text-red-600">Error uploading resume. Please try again.</div>
          )}
        </div>

          </>
        )}

        <button
          disabled={loading}
          className="dark:bg-blue-500 shadow-md text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  );
}
