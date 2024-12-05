import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:10000'); // Your backend URL

const MentorChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState(['student1', 'student2']); // Replace with actual logic
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    // Register user
    if (currentUser) {
      socket.emit('registerUser', { username: currentUser.username });
    }

    // Fetch students (you'll need to implement this)
    const fetchStudents = async () => {
      // Implement logic to fetch students
    };
    fetchStudents();

    if (currentChat) {
      // Fetch previous messages
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `/api/messages?sender=${currentUser.username}&receiver=${currentChat}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }

    // Listen for messages
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
                key={student}
                onClick={() => setCurrentChat(student)}
                className={`cursor-pointer hover:text-blue-500 p-2 ${
                  currentChat === student ? 'bg-blue-100' : ''
                }`}
              >
                {student}
              </li>
            ))}
          </ul>
        </div>

        {/* Current Chat Section */}
        {currentChat && (
          <div>
            <h4 className="font-semibold mb-4">Chat with {currentChat}</h4>
            <div className="space-y-4 mb-4 h-64 overflow-y-auto">
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
        )}
      </div>
    </div>
  );
};

export default MentorChatApp;