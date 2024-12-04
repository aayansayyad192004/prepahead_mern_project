import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const StudentChatApp = () => {
  const location = useLocation();
  const { mentor } = location.state; // Mentor data passed from the MentorshipPage
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: 'You',
        content: message,
      };
      socket.emit('sendMessage', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="bg-blue-500 text-white py-4 px-6 flex items-center">
        <img
          src={mentor.profilePicture}
          alt={mentor.name}
          className="w-10 h-10 rounded-full mr-4"
        />
        <h1 className="text-lg font-semibold">{mentor.name}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded-lg ${
              msg.sender === 'You'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-800 self-start'
            }`}
          >
            <span>{msg.sender}: </span>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gray-200 flex items-center">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentChatApp;
