import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationList from './ConversationList';
import MessageList from './MessageList';

const ConnectNow = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Fetch mentor details based on mentorId
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await fetch(`/api/mentors/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mentor details');
        }
        const mentorData = await response.json();
        setMentor(mentorData);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
      }
    };

    if (mentorId) {
      fetchMentorDetails();
    }
  }, [mentorId]);

  const goBack = () => {
    navigate('/MentorshipPage');
  };

  const handleStartChat = () => {
    // Generate a unique conversation ID with mentor information
    const conversationID = `chat_${mentorId}_${Date.now()}`;
    setSelectedConversation(conversationID);
  };

  const handleScheduleCall = () => {
    const roomID = Math.floor(Math.random() * 10000) + "";
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
            {mentor && (
              <div className="mb-4">
                <img 
                  src={mentor.profilePicture} 
                  alt={mentor.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-2"
                />
                <p className="text-white font-semibold">{mentor.name}</p>
              </div>
            )}
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

        {/* Chat Interface */}
        {selectedConversation && mentor && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <ConversationList 
                mentorId={mentorId}
                onSelectConversation={setSelectedConversation}
              />
            </div>
            <div className="col-span-2">
              <MessageList 
                conversationID={selectedConversation} 
                mentor={mentor}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectNow;