import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from students
    socket.on('receiveMessage', (newMessage) => {
      // Only display messages sent to the mentor
      if (newMessage.mentorId === currentUser.username) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Listen for the list of connected students
    socket.on('userList', (updatedUsers) => {
      setStudents(updatedUsers);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userList');
    };
  }, [currentUser]);

  const handleSendMessage = (studentId) => {
    if (message.trim()) {
      const messageData = {
        message,
        userId: currentUser.username,
        studentId,
        mentorId: currentUser.username // Ensure the message goes to the correct mentor
      };

      socket.emit('sendMessage', messageData); // Emit message to backend
      setMessages((prevMessages) => [...prevMessages, messageData]); // Update local state
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {/* Displaying Mentor Profile with Image */}
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>
        <div className="flex items-center mb-4">
          <img src={currentUser.profilePicture} alt="Mentor Profile" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {/* Messages Section */}
        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Messages:</h3>
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start space-x-2">
                <strong className={`text-${msg.userId === currentUser.username ? 'green' : 'blue'}-500`}>
                  {msg.userId}:
                </strong>
                <span className="text-gray-700">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Students */}
        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Connected Students:</h3>
          <ul>
            {students.map((student, index) => (
              <li key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={student.profilePhoto} alt={`${student.username} Profile`} className="w-8 h-8 rounded-full mr-4" />
                  <span>{student.username}</span>
                </div>
                <button
                  onClick={() => handleSendMessage(student.username)}
                  className="text-blue-500"
                >
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Message Input */}
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
    </div>
  );
};

export default MentorChatApp;
