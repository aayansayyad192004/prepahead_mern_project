import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ConnectNow = () => {
  const { mentorId } = useParams(); // Get mentorId from URL params
  const navigate = useNavigate();

  // Handle mentor-specific data fetching here
  // Example: Fetch mentor data based on mentorId if needed

  const goBack = () => {
    navigate('/MentorshipPage'); // Go back to Mentorship page
  };

  const handleStartChat = () => {
    if (!mentorId) {
      alert("Mentor ID is missing. Cannot start chat.");
      return;
    }
    // Navigate to the StudentChatApp or MentorChatApp
    navigate(`/student-chat/${mentorId}`); // Passing mentorId to student chat route
  };


  const handleScheduleCall = () => {
    // Generate a random roomID (or implement logic to fetch based on mentor)
    const roomID = Math.floor(Math.random() * 10000) + "";

    // Navigate to the StudentVideoCall page with the roomID
    navigate(`/video-call/${roomID}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="container mx-auto max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="text-blue-400 mb-6 flex items-center hover:text-blue-500 transition-all duration-300"
        >
          &larr; Back to Mentorship
        </button>

        {/* Communication Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Chat Option */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl text-blue-400 mb-4">Chat with Mentor</h2>
            <p className="text-gray-400 mb-6">
              Start a text conversation with your mentor anytime.
            </p>
            <button
              onClick={handleStartChat}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg font-medium"
            >
              Start Chat
            </button>
          </div>

          {/* Schedule Call Option */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl text-blue-400 mb-4">Schedule a Call</h2>
            <p className="text-gray-400 mb-6">
              Schedule a call with your mentor based on their availability.
            </p>
            <button
              onClick={handleScheduleCall}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg font-medium"
            >
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectNow;
