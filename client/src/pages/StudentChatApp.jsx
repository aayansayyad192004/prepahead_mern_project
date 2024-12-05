import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

// Connect to the current domain automatically
const socket = io();

const StudentChatApp = ({ mentorId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentorInfo, setMentorInfo] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Fetch mentor info using relative URL
    fetch(`/mentor/${mentorId}`)
      .then((response) => response.json())
      .then((data) => setMentorInfo(data))
      .catch((error) => console.error('Error fetching mentor info:', error));

    // Listen for messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

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

  if (!currentUser || !mentorInfo) return <p>Loading...</p>;

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

        <div className="flex items-center mb-4">
          <img
            src={mentorInfo?.profilePicture || '/placeholder.png'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{mentorInfo?.username || 'Loading...'}</p>
            <p>{mentorInfo?.email || 'Loading...'}</p>
          </div>
        </div>

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
