import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from 'axios';

const socket = io('http://localhost:10000');

const MentorChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`/api/mentors/students?mentorUsername=${currentUser.username}`);
          setStudents(response.data);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      }
    };

    fetchStudents();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.emit('registerUser', { username: currentUser.username });
    }

    if (currentChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/messages?sender=${currentChat}&receiver=${currentUser.username}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }

    socket.on('receiveMessage', (newMessage) => {
      if (
        (newMessage.sender === currentChat && newMessage.receiver === currentUser.username) ||
        (newMessage.sender === currentUser.username && newMessage.receiver === currentChat)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, currentChat]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser && currentChat) {
      const messageData = {
        sender: currentUser.username,
        receiver: currentChat,
        message
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
        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Select a Student to Chat:</h3>
          <ul>
            {Array.isArray(students) && students.map((student) => (
              <li
                key={student.username}
                onClick={() => setCurrentChat(student.username)}
                className={`cursor-pointer hover:text-blue-500 p-2 flex items-center ${currentChat === student.username ? 'bg-blue-100' : ''}`}
              >
                {student.profilePicture && (
                  <img
                    src={student.profilePicture}
                    alt={student.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div>
                  <span>{student.username}</span>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Messages with {currentChat}:</h3>
          <div className="space-y-2 h-64 overflow-y-auto">
            {Array.isArray(messages) && messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-2 rounded-lg ${msg.sender === currentUser.username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg.message}
                </div>
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

export default MentorChatApp;
