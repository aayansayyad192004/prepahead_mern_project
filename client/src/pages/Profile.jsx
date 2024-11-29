import { useSelector} from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const resumeRef = useRef(null);
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [resumePercent, setResumePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [resumeError, setResumeError] = useState(false);
  const [formData, setFormData] = useState({});
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resumeURL, setResumeURL] = useState('');

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      setResumeURL(currentUser.resumeURL || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (image) {
      handleFileUpload(image, 'profilePicture', setImagePercent, setImageError);
    }
    if (resume) {
      handleFileUpload(resume, 'resumeURL', setResumePercent, setResumeError);
    }
  }, [image, resume]);

  const handleFileUpload = async (file, fieldName, setPercent, setError) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fieldName === 'profilePicture' ? setImagePercent(progress) : setResumePercent(progress);
      },
      
      
      (error) => {
        console.error('Upload error:', error);
        setError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, [fieldName]: downloadURL }));
          
          if (fieldName === 'resumeURL') {
            setResumeURL(downloadURL);
          }
        });
      }
    );
  };

  const handleChange = (e) => {
    
    setFormData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  
  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/${currentUser._id}`);
      if (!res.ok) {
        const errorText = await res.text(); // Get error response text
        console.error('Server response:', errorText); // Log the response
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.error('Error fetching user:', error);
      dispatch(updateUserFailure(error));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    console.log('Current User ID:', currentUser._id);

    if (!currentUser || !currentUser._id) {
      console.error('No current user found');
      setErrorMessage('User not found.');
      return;
    }

    const updatedData = { ...formData,  profilePicture: formData.profilePicture || currentUser.profilePicture,
      resumeURL: formData.resumeURL || currentUser.resumeURL, };

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Response error status:', res.status, errorData);
        dispatch(updateUserFailure(errorData));
        setErrorMessage(errorData.message || 'Failed to update profile.');
        return;
      }

      const data = await res.json();
      console.log('Response Data:', data);

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setFormData({}); // Reset form data if needed
    } catch (error) {
      console.error('Update error:', error.message);
      dispatch(updateUserFailure(error));
      setErrorMessage('An error occurred while updating the profile.');
    }
  };
  
const handleDeleteAccount = async () => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error));
  }
};
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className='p-6 max-w-xl mx-auto  bg-white shadow-lg rounded-md'>
      <h1 className='text-3xl font-bold text-center my-5 text-gray-800'>Profile</h1>
      <form onSubmit={handleSubmit} className='space-y-6 mx-8 '>
        {errorMessage && <p className='text-red-600 text-center'>{errorMessage}</p>}

        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 mx-auto cursor-pointer rounded-full object-cover border-4 border-blue-500'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm text-center'>
          {imageError ? (
            <span className='text-red-700'>Error uploading image (max 2 MB)</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-gray-700'>{`Uploading: ${imagePercent}%`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : ''}
        </p>
    <div>
    <label htmlFor='username' className='block text-gray-700 font-medium'>
      User Name
    </label>
    <input
      defaultValue={currentUser.username}
      type='text'
      id='username'
      placeholder='User Name'
      className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      onChange={handleChange}
    />
  </div>

  {/* Full Name */}
  <div>
    <label htmlFor='name' className='block text-gray-700 font-medium'>
      Full Name
    </label>
    <input
      defaultValue={currentUser.name}
      type='text'
      id='name'
      placeholder='Full Name'
      className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      onChange={handleChange}
    />
  </div>

  {/* Email Address */}
  <div>
    <label htmlFor='email' className='block text-gray-700 font-medium'>
      Email Address
    </label>
    <input
      defaultValue={currentUser.email}
      type='email'
      id='email'
      placeholder='Email Address'
      className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      onChange={handleChange}
      required
    />
  </div>

  {/* Password */}
  <div>
    <label htmlFor='password' className='block text-gray-700 font-medium'>
      Password
    </label>
    <input
      type='password'
      id='password'
      placeholder='Password'
       className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      defaultValue={currentUser.password} // Use defaultValue to set the initial value
      onChange={handleChange} // This will handle any changes if needed
    />
  </div>

  {/* Phone Number */}
  <div>
    <label htmlFor='phone' className='block text-gray-700 font-medium'>
      Phone Number
    </label>
    <input
      defaultValue={currentUser.phone}
      type='tel'
      id='phone'
      placeholder='Phone Number'
      className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      onChange={handleChange}
      required
    />
  </div>

  {/* Address */}
  <div>
    <label htmlFor='address' className='block text-gray-700 font-medium'>
      Address
    </label>
    <input
      defaultValue={currentUser.address}
      type='text'
      id='address'
      placeholder='Address'
      className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
      onChange={handleChange}
    />
  </div>

  {/* Conditional Fields for Mentor */}
  {currentUser.role === 'mentor' ? (
    <>
      <div>
        <label htmlFor='expertiseAreas' className='block text-gray-700 font-medium'>
          Expertise Areas
        </label>
        <input
          defaultValue={currentUser.expertiseAreas}
          type='text'
          id='expertiseAreas'
          placeholder='Expertise Areas (e.g., Web Development, Data Science)'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='experienceLevel' className='block text-gray-700 font-medium'>
          Experience Level
        </label>
        <input
          defaultValue={currentUser.experienceLevel}
          type='text'
          id='experienceLevel'
          placeholder='Experience Level (e.g., 5 years)'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='availability' className='block text-gray-700 font-medium'>
          Mentorship Availability
        </label>
        <input
          defaultValue={currentUser.availability}
          type='text'
          id='availability'
          placeholder='Mentorship Availability (e.g., Weekends)'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='linkedin' className='block text-gray-700 font-medium'>
          LinkedIn Profile URL
        </label>
        <input
          defaultValue={currentUser.linkedin}
          type='url'
          id='linkedin'
          placeholder='LinkedIn Profile URL'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='mentorBio' className='block text-gray-700 font-medium'>
          Mentor Bio
        </label>
        <textarea
          defaultValue={currentUser.mentorBio}
          id='mentorBio'
          placeholder='Brief Bio'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='hourlyRate' className='block text-gray-700 font-medium'>
          Hourly Rate (if applicable)
        </label>
        <input
          defaultValue={currentUser.hourlyRate}
          type='number'
          id='hourlyRate'
          placeholder='Hourly Rate'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='companyName' className='block text-gray-700 font-medium'>
          Company Name
        </label>
        <input
          defaultValue={currentUser.companyName}
          type='text'
          id='companyName'
          placeholder='Company Name'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>
    </>
  ) : (
    <>
      <div>
        <label htmlFor='jobNiche1' className='block text-gray-700 font-medium'>
          Job Niche 1
        </label>
        <input
          defaultValue={currentUser.jobNiche1}
          type='text'
          id='jobNiche1'
          placeholder='Job Niche 1'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='jobNiche2' className='block text-gray-700 font-medium'>
          Job Niche 2
        </label>
        <input
          defaultValue={currentUser.jobNiche2}
          type='text'
          id='jobNiche2'
          placeholder='Job Niche 2'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='jobNiche3' className='block text-gray-700 font-medium'>
          Job Niche 3
        </label>
        <input
          defaultValue={currentUser.jobNiche3}
          type='text'
          id='jobNiche3'
          placeholder='Job Niche 3'
           className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />
      </div>
      {/* Resume */}
  <div>
    <label htmlFor='resume' className='block text-gray-700 font-medium'>
      Resume
    </label>
     <input
          
          type='file'
          ref={resumeRef}
          hidden
          accept='.pdf'
          onChange={(e) => setResume(e.target.files[0])}
        />
        <p
          className='block text-center text-blue-600  font-semibold hover:text-blue-700 mt-4 mb-4 transition-all duration-300 ease-in-out transform hover:scale-105'
          onClick={() => resumeRef.current.click()}
        >
          {resumeURL ? 'Replace Resume' : 'Upload Resume'}
        </p>
        {resumeError && <p className='text-red-600 text-center'>Error uploading resume</p>}
        {resumePercent > 0 && resumePercent < 100 && (
          <p className='text-gray-700 text-center'>{`Uploading Resume: ${resumePercent}%`}</p>
        )}
        {resumePercent === 100 && (
          <p className='text-green-600 text-center'>Resume uploaded successfully</p>
        )}
        {resumeURL && (
          <p className='text-center'>
            <a
              defaultValue={currentUser.resumeURL}
              href={resumeURL}
              target='_blank'
              rel='noopener noreferrer'
              className='block text-center text-teal-600 font-semibold hover:text-teal-700 mb-4 transition-all duration-300 ease-in-out transform hover:scale-105'
            >
              View Uploaded Resume
            </a>
          </p>
        )}
  </div>

    </>
  )}

  


       
        {updateSuccess && <p className='text-center text-green-700'>Profile updated successfully!</p>}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white rounded-lg p-3 mt-5'
          disabled={loading}
        >
          Update Profile
        </button>

        <button
          type='button'
          onClick={handleDeleteAccount}
          className='w-full bg-red-600 text-white rounded-lg p-3 mt-5'
        >
          Delete Account
        </button>

        <button
          type='button'
          onClick={handleSignOut}
          className='w-full bg-gray-600 text-white rounded-lg p-3 mt-5'
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}