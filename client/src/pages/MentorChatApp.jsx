import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('userList', (updatedUsers) => {
      setStudents(updatedUsers);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userList');
    };
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit('mentorLogin', { username });
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (studentId) => {
    if (message.trim()) {
      socket.emit('sendMessage', {
        message,
        userId: username,
        studentId,
      });
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {!isLoggedIn ? (
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full mb-4"
            />
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg w-full"
            >
              Log in as Mentor
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Mentor Chat</h2>

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

            <div className="space-y-4">
              <h3 className="font-semibold">Connected Students:</h3>
              <ul>
                {students.map((student, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{student}</span>
                    <button
                      onClick={() => handleSendMessage(student)}
                      className="text-blue-500"
                    >
                      Chat
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center space-y-4 mt-4">
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full"
              />
              <button
                onClick={() => handleSendMessage()}
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

export default MentorChatApp;
