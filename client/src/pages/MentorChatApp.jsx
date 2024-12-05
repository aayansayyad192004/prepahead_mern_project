import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      if (newMessage.mentorId === currentUser.username) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Fetch students list
    socket.on('userList', (updatedUsers) => {
      setStudents(updatedUsers);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userList');
    };
  }, [currentUser]);

  const handleSendMessage = () => {
    if (message.trim() && selectedStudent) {
      const messageData = {
        message,
        userId: currentUser.username,
        studentId: selectedStudent.username,
        mentorId: currentUser.username,
      };

      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

        {/* Mentor Profile */}
        <div className="flex items-center mb-4">
          <img
            src={currentUser.profilePicture || '/placeholder.png'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
          </div>
        </div>

        {/* Select Student */}
        <div className="mb-4">
          <h3 className="font-semibold">Select a Student:</h3>
          <select
            onChange={(e) => setSelectedStudent(JSON.parse(e.target.value))}
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">-- Select a Student --</option>
            {students.map((student) => (
              <option key={student.username} value={JSON.stringify(student)}>
                {student.username}
              </option>
            ))}
          </select>
        </div>

        {/* Messages Section */}
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

export default MentorChatApp;
