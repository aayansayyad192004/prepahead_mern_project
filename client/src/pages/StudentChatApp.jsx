import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const StudentChatApp = ({ mentorId }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('newUser', username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message to mentor (if logged in as student)
      socket.emit('sendMessage', { message, userId: username, mentorId });
      setMessage(''); // Clear message input
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
            />
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Welcome, {username}</h2>

            <div className="space-y-4 mb-4">
              <h3 className="font-semibold">Messages:</h3>
              <div className="space-y-2">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <strong className="text-blue-500">{msg.userId}:</strong>
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
        )}
      </div>
    </div>
  );
};

export default StudentChatApp;
