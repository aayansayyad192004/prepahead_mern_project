import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

// Replace with your actual backend URL
const BACKEND_URL = 'http://localhost:10000';
const socket = io(BACKEND_URL);

const StudentChatApp = ({ mentorId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [mentorError, setMentorError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch mentor information based on mentorId
    fetch(`${BACKEND_URL}/mentor/${mentorId}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching mentor info: ${response.status} - ${errorText}`);
        }
        return response.json();
      })
      .then((data) => {
        setMentorInfo(data); // Set the mentor info to the state
        setMentorError(null); // Clear previous errors
      })
      .catch((error) => {
        console.error('Error fetching mentor info:', error);
        setMentorError('Failed to load mentor information.');
      });
  
    // Listen for new messages from the mentor
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    // Cleanup the socket listener on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [mentorId]);
  

  const handleSendMessage = () => {
    if (message.trim() && currentUser && mentorId) {
      const messageData = { message, userId: currentUser.username, mentorId };

      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

  if (!currentUser) return <p>Loading user information...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

        <div className="flex items-center mb-4">
          <img
            src={currentUser?.profilePicture || '/placeholder.png'}
            alt="Student Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {mentorError ? (
          <p className="text-red-500">{mentorError}</p>
        ) : mentorInfo ? (
          <div className="flex items-center mb-4">
            <img
              src={mentorInfo?.profilePicture || '/placeholder.png'}
              alt="Mentor Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{mentorInfo?.username}</p>
              <p>{mentorInfo?.email}</p>
            </div>
          </div>
        ) : (
          <p>Loading mentor information...</p>
        )}

        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Messages:</h3>
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-2">
                <strong
                  className={`${
                    msg.userId === currentUser.username ? 'text-green-500' : 'text-blue-500'
                  }`}
                >
                  {msg.userId}:
                </strong>
                <span className="text-gray-700">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChatApp;
