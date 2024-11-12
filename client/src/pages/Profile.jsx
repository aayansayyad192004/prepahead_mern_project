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
  const [selectedNiches, setSelectedNiches] = useState([]);
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
        setPercent(Math.round(progress));
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

  const handleNicheChange = (e) => {
    if (e.target.tagName === 'SELECT') {
      const options = Array.from(e.target.selectedOptions, (option) => option.value);
      if (options.length <= 3) {
        setSelectedNiches(options);
        setFormData((prevData) => ({ ...prevData, jobNiches: options }));
      }
    }
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

    const updatedData = { ...formData, resumeURL };

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

  const jobNiches = [
    'Web Development', 'Frontend Developer', 'Backend Developer',
    'Full Stack Web Developer', 'MERN Stack Developer', 'Cybersecurity',
    'Data Science', 'Artificial Intelligence', 'Cloud Computing', 'DevOps',
    'Mobile App Development', 'Blockchain', 'Database Administration',
    'Network Administration', 'UI/UX Design', 'Game Development',
    'IoT (Internet of Things)', 'Big Data', 'Machine Learning',
    'IT Project Management', 'IT Support and Helpdesk',
    'Systems Administration', 'IT Consulting'
  ];

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className='p-6 max-w-xl mx-auto bg-white shadow-lg rounded-md'>
      <h1 className='text-3xl font-bold text-center my-5 text-gray-800'>Profile</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
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

        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Full Name'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
          
        />

        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email Address'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
          required
        />

        <input
          defaultValue={currentUser.phoneNumber}
          type='text'
          id='phoneNumber'
          placeholder='Phone Number'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
          required
        />

        <input
          defaultValue={currentUser.address}
          type='text'
          id='address'
          placeholder='Address'
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleChange}
        />

        <label className='font-semibold mb-2 block text-gray-700'>Select up to 3 Job Niches:</label>
        <p className='text-sm text-gray-500'>
          (Hold down the Ctrl (Windows) or Command (Mac) button to select multiple options.)
        </p>
        <select
          multiple
          className='w-full bg-gray-100 rounded-lg p-3 border border-gray-200'
          onChange={handleNicheChange}
        >
          {jobNiches.map((niche, index) => (
            <option key={index} value={niche}>
              {niche}
            </option>
          ))}
        </select>

        <input
          type='file'
          ref={resumeRef}
          hidden
          accept='.pdf'
          onChange={(e) => setResume(e.target.files[0])}
        />
        <p
          className='text-center text-blue-700 cursor-pointer underline'
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
              href={resumeURL}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:underline'
            >
              View Uploaded Resume
            </a>
          </p>
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