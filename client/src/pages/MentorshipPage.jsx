import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
const MentorshipPage = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedField, setSelectedField] = useState();
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();
  // Fetch mentors when component mounts
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors'); // Ensure this endpoint is correct
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Check if data is valid and process it
        if (Array.isArray(data)) {
          setMentors(data);

          // Extract unique expertise areas
          const uniqueFields = Array.from(
            new Set(
              data.flatMap((mentor) => mentor.expertiseAreas || []) // Flatten and remove duplicates
            )
          );
          setFields(uniqueFields);  // Set the fields dynamically
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors by selected field
  const filteredMentors = selectedField
    ? mentors.filter((mentor) =>
        mentor.expertiseAreas && mentor.expertiseAreas.includes(selectedField)
      )
    : mentors;
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">
        Find Your Perfect Mentor
      </h1>

      {/* Field Selector */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
  {fields.length > 0 ? (
    fields.map((field) => (
      <button
        key={field}
        className={`px-6 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${
          selectedField === field
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        onClick={() => setSelectedField(field)}
      >
        {field}
      </button>
    ))
  ) : (
    <p className="text-gray-400 text-center">Loading expertise fields...</p>
  )}
</div>


      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center"
            >
              {/* Profile Picture */}
              <img
                src={mentor.profilePicture}
                alt={mentor.name}
                className="w-28 h-28 rounded-full mb-4 border-4 border-blue-500 shadow-md"
              />
              {/* Mentor Name */}
              <h2 className="text-2xl font-bold text-center mb-3 text-white">
                {mentor.name}
              </h2>
              <div className="w-full border-t border-gray-600 my-6"></div>
{/* Expertise and Details */}
<div className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400 text-sm">
    {/* Expertise */}
    <div className="flex items-center">
      <span className="font-bold text-gray-300 w-1/3 mr-4">Expertise:</span>
      <span className="text-gray-400">{mentor.expertiseAreas}</span>
    </div>
    
    {/* Experience */}
    <div className="flex items-center">
      <span className="font-bold text-gray-300 w-1/3 mr-6">Experience:</span>
      <span className="text-gray-400">{mentor.experienceLevel}</span>
    </div>

    {/* Company */}
    <div className="flex items-center">
      <span className="font-bold text-gray-300 w-1/3 mr-4">Company:</span>
      <span className="text-gray-400">{mentor.companyName}</span>
    </div>

    {/* Availability */}
    <div className="flex items-center">
      <span className="font-bold text-gray-300 w-1/3 mr-6">Availability:</span>
      <span className="text-gray-400">{mentor.availability}</span>
    </div>
  </div>

  {/* LinkedIn Profile */}
  <div className="flex justify-center">
    <a
      href={mentor.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-400 font-semibold underline transition duration-200 ease-in-out"
    >
      View LinkedIn Profile
    </a>
  </div>
</div>

              <div className="w-full border-t border-gray-600 my-3"></div>
              {/* Mentor Bio */}
              <p className="text-center text-gray-300 italic text-sm mb-4">
                "{mentor.mentorBio}"
              </p>
              {/* Rating */}
              <div className="text-yellow-500 font-semibold text-lg mb-4">
              ⭐⭐⭐⭐ {mentor.rating} 
              </div>
              {/* Book Session Button */}
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg font-medium shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                onClick={() => navigate(`/connectnow/${mentor._id}`)} // Navigate to the ConnectNow page with mentor's ID
              >
                Connect Now
              </button>

            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-3">
            No mentors found for the selected field. Please try a different field.
          </p>
        )}
      </div>
    </div>
  );
}
export default MentorshipPage;
