import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const MentorChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState([]); // List of students
  const [currentChat, setCurrentChat] = useState(null); // Current student being chatted with

  // Fetch students associated with the current mentor
  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch(`http://localhost:10000/api/students/${currentUser._id}`); // Fetch students by mentorId
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data); // Set the fetched students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents(); // Fetch students when the component mounts

    if (currentChat) {
      // Fetch previous messages when currentChat changes
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:10000/api/messages?sender=${currentUser.username}&receiver=${currentChat}`
          );
          const data = await response.json();
          setMessages(data); // Set the fetched messages
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }

    // Socket listener to receive messages
    socket.on('receiveMessage', (newMessage) => {
      if (
        (newMessage.sender === currentUser.username && newMessage.receiver === currentChat) ||
        (newMessage.sender === currentChat && newMessage.receiver === currentUser.username)
      ) {
        setMessages((prev) => [...prev, newMessage]); // Append the received message to messages
      }
    });

    // Cleanup: Remove socket listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, currentChat]); // Dependency on currentUser and currentChat

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        sender: currentUser.username,
        receiver: currentChat,
        message,
      };

      socket.emit('sendMessage', messageData); // Emit the message via socket
      setMessages((prev) => [...prev, messageData]); // Update local messages
      setMessage(''); // Clear the input field
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
                key={student._id}
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
                  <strong
                    className={`text-${msg.sender === currentUser.username ? 'green' : 'blue'}-500`}
                  >
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
