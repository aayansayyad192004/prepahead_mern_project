import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState([]); // Replace with logic to fetch actual students

  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    // Fetch student list (replace with actual data fetching logic)
    const fetchStudents = async () => {
      const response = await fetch('http://localhost:10000/api/students');
      const data = await response.json();
      setStudents(data);
    };

    fetchStudents();

    if (currentChat) {
      // Fetch previous messages
      const fetchMessages = async () => {
        const response = await fetch(
          `http://localhost:10000/api/messages?sender=${currentUser.username}&receiver=${currentChat}`
        );
        const data = await response.json();
        setMessages(data);
      };

      fetchMessages();
    }

    socket.on('receiveMessage', (newMessage) => {
      if (
        (newMessage.sender === currentUser.username && newMessage.receiver === currentChat) ||
        (newMessage.sender === currentChat && newMessage.receiver === currentUser.username)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, currentChat]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        sender: currentUser.username,
        receiver: currentChat,
        message,
      };

      socket.emit('sendMessage', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Mentor Chat</h2>

        {/* Students List */}
        <div className="mb-4">
          <h3 className="font-semibold">Select a Student to Chat:</h3>
          <ul>
            {students.map((student) => (
              <li
                key={student.username}
                onClick={() => setCurrentChat(student.username)} // Set chat with selected student
                className="cursor-pointer hover:text-blue-500"
              >
                {student.username} {/* Display student name */}
              </li>
            ))}
          </ul>
        </div>

        {/* Current Chat Section */}
        {currentChat && (
          <div>
            <h4 className="font-semibold mb-4">Chat with {currentChat}</h4>
            <div className="space-y-4 mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <strong className={`text-${msg.sender === currentUser.username ? 'green' : 'blue'}-500`}>
                    {msg.sender}:
                  </strong>
                  <span className="text-gray-700">{msg.message}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
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

export default MentorChatApp;
