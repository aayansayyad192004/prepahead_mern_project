import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from 'axios';

const socket = io('http://localhost:10000');

const StudentChatApp = ({ mentorId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Register user
    if (currentUser) {
      socket.emit('registerUser', { username: currentUser.username });
    }

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/messages?sender=${currentUser.username}&receiver=${mentorId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Listen for messages
    socket.on('receiveMessage', (newMessage) => {
      // Ensure the message is for this specific conversation
      if (
        (newMessage.sender === mentorId && newMessage.receiver === currentUser.username) ||
        (newMessage.sender === currentUser.username && newMessage.receiver === mentorId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, mentorId]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        sender: currentUser.username,
        receiver: mentorId,
        message
      };

      socket.emit('sendMessage', messageData);
      // Optimistically add message to UI
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

        {/* Displaying Student Profile with Image */}
        <div className="flex items-center mb-4">
          <img 
            src={currentUser.profilePicture} 
            alt="Student Profile" 
            className="w-12 h-12 rounded-full mr-4" 
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {/* Messages Section */}
        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Messages with {mentorId}:</h3>
          <div className="space-y-2 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex items-start space-x-2 ${
                  msg.sender === currentUser.username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  msg.sender === currentUser.username 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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