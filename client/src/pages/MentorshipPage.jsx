import React, { useState, useEffect } from 'react';

const MentorshipPage = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedField, setSelectedField] = useState('Frontend Developer');

  // Fetch mentors when component mounts
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors'); // Assuming this is the correct route
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors by expertise
  const filteredMentors = mentors.filter(
    (mentor) => mentor.expertiseAreas === selectedField
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">
        Find Your Perfect Mentor
      </h1>

      {/* Field Selector */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {['Frontend Developer', 'Backend Developer', '.NET', 'AI/ML Expert'].map((field) => (
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
        ))}
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
              <div className="w-full border-t border-gray-600 my-3"></div>
              {/* Expertise and Details */}
              <div className="text-center text-sm text-gray-400 space-y-2">
                <p>
                  <span className="font-semibold text-gray-300">Expertise:</span> {mentor.expertiseAreas}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Experience:</span> {mentor.experienceLevel}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Company:</span> {mentor.companyName}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Availability:</span> {mentor.availability}
                </p>
                <a
                  href={mentor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View LinkedIn Profile
                </a>
              </div>
              <div className="w-full border-t border-gray-600 my-3"></div>
              {/* Mentor Bio */}
              <p className="text-center text-gray-300 italic text-sm mb-4">
                "{mentor.mentorBio}"
              </p>
              {/* Rating */}
              <div className="text-yellow-500 font-semibold text-lg mb-4">
                ⭐ {mentor.rating} 
              </div>
              {/* Book Session Button */}
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg font-medium shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                onClick={() => {
                  alert('Redirecting to payment gateway...');
                }}
              >
                Book Session Now
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
