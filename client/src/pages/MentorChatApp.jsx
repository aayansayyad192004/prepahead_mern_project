import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [students, setStudents] = useState([]); // List of connected students

  useEffect(() => {
    // Listen for new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for updated list of students
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
      socket.emit('newUser', username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (studentId) => {
    if (message.trim()) {
      socket.emit('sendMessage', { message, userId: username, studentId });
      setMessage(''); // Clear message input
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {!isLoggedIn ? (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-72"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-2 rounded-md w-72 hover:bg-blue-600"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold">Welcome, {username}</h2>

          <div className="w-full space-y-4">
            <h3 className="text-xl font-medium">Messages:</h3>
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col">
                  <strong className="text-lg">{msg.userId}:</strong>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full space-y-2">
            <h3 className="text-xl font-medium">Select a Student:</h3>
            <ul className="space-y-2">
              {students.map((student, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSendMessage(student.id)} // Use student.id
                    className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600"
                  >
                    Message {student.username}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center space-y-2 w-full">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-72"
            />
            <button
              onClick={() => handleSendMessage()}
              className="bg-blue-500 text-white p-2 rounded-md w-72 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorChatApp;
