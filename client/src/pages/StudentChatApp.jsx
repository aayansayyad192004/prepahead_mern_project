import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const socket = io(import.meta.env.VITE_BASE_URL); // Replace with your backend URL

const StudentChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentor, setMentor] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { mentorId } = useParams();

  useEffect(() => {
    const fetchMentorInfo = async () => {
      try {
        const response = await fetch(`/api/mentors/${mentorId}`);
        const mentorData = await response.json();
        setMentor(mentorData);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/messages?sender=${currentUser.username}&receiver=${mentor?.username}`);
        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMentorInfo();
    if (mentor) fetchMessages();

    const handleNewMessage = (newMessage) => {
      const isRelevant = (newMessage.sender === mentor?.username && newMessage.receiver === currentUser.username) || 
                         (newMessage.sender === currentUser.username && newMessage.receiver === mentor?.username);
      if (isRelevant) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [mentorId, currentUser.username, mentor?.username]);

  const handleSendMessage = async () => {
    if (message.trim() && mentor) {
      const messageData = {
        message,
        sender: currentUser.username,
        receiver: mentor.username,
      };

      try {
        socket.emit('sendMessage', messageData);

        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) throw new Error('Error saving message');

        const savedMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!currentUser || !mentor) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-teal-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        {/* Header UI */}
        <div className="flex justify-between items-center mb-6 bg-gray-800  p-4 rounded-t-lg shadow-md">
          <div className="flex items-center space-x-4">
            <img
              src={mentor.profilePicture || 'https://via.placeholder.com/150'}
              alt="Mentor Profile"
              className="w-16 h-16 rounded-full shadow-lg"
            />
            <div>
              <p className="text-2xl font-bold text-gray-200 hover:text-blue-400 transition duration-300 ease-in-out">{mentor.username}</p>
              <p className="text-gray-400 italic mt-1">{mentor.email}</p>
            </div>
          </div>

         
        </div>

        {/* Messages Section */}
        <div className="space-y-4 mb-4 overflow-y-auto h-72 border-t-2 pt-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'} items-start`}>
              {msg.sender !== currentUser.username && mentor.profilePicture && (
                <img
                  src={mentor.profilePicture}
                  alt={`${msg.sender}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 mr-3"
                />
              )}

              <div className={`p-3 max-w-xs rounded-lg ${msg.sender === currentUser.username ? 'bg-blue-100' : 'bg-green-100'} shadow-md`}>
                <strong className="text-sm block mb-1">
                  {msg.sender === currentUser.username ? 'You' : msg.sender}
                </strong>
                <p className="text-gray-800">{msg.message}</p>
              </div>

              {msg.sender === currentUser.username && currentUser.profilePicture && (
                <img
                  src={currentUser.profilePicture}
                  alt={`${currentUser.username}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 ml-3"
                />
              )}
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
            className="p-3 border-2 border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChatApp;
