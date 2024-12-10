import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Socket connection
const BASE_URL = 'http://localhost:10000';
const socket = io(BASE_URL);

const StudentChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentor, setMentor] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { mentorId } = useParams();

  // Fetch all messages between student and mentor
  const fetchAllMessages = async (mentorUsername) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/chat/messages?sender=${currentUser.username}&receiver=${mentorUsername}`
      );
      
      if (!response.ok) throw new Error('Error fetching messages');
      
      const messagesData = await response.json();
      
      // Sort messages by timestamp to ensure correct order
      const sortedMessages = messagesData.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch mentor details
  useEffect(() => {
    const fetchMentorInfo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mentors/${mentorId}`);
        if (!response.ok) throw new Error('Error fetching mentor details');
        
        const mentorData = await response.json();
        setMentor(mentorData);
        
        // Fetch messages once mentor info is available
        fetchAllMessages(mentorData.username);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      }
    };

    fetchMentorInfo();
  }, [mentorId, currentUser.username]);

  // Handle incoming messages
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Ensure the message is related to this specific chat
      const isRelevant = 
        (newMessage.sender === mentor?.username && newMessage.receiver === currentUser.username) ||
        (newMessage.sender === currentUser.username && newMessage.receiver === mentor?.username);

      if (isRelevant) {
        setMessages((prevMessages) => {
          // Prevent duplicate messages
          const isDuplicate = prevMessages.some(
            msg => msg._id === newMessage._id || 
                   (msg.message === newMessage.message && 
                    msg.sender === newMessage.sender && 
                    msg.timestamp === newMessage.timestamp)
          );

          if (!isDuplicate) {
            return [...prevMessages, newMessage].sort((a, b) => 
              new Date(a.timestamp) - new Date(b.timestamp)
            );
          }
          return prevMessages;
        });
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [currentUser.username, mentor?.username]);

  const handleSendMessage = async () => {
    if (message.trim() && mentor) {
      const messageData = {
        message,
        sender: currentUser.username,
        receiver: mentor.username,
      };

      try {
        // Emit the message to the socket
        socket.emit('sendMessage', messageData);

        // Save the message in the database
        const response = await fetch(`${BASE_URL}/api/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) throw new Error('Error saving message');

        const savedMessage = await response.json();
        
        // Update messages state
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, savedMessage].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          return updatedMessages;
        });
        
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (!currentUser || !mentor) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Chat with Mentor: {mentor.username}</h2>
        <div className="flex items-center mb-4">
          <img
            src={mentor.profilePicture || 'https://via.placeholder.com/150'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="font-semibold">{mentor.username}</p>
            <p>{mentor.email}</p>
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <h3 className="font-semibold">Messages:</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto border p-2 rounded">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.sender === currentUser.username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`
                  p-2 rounded max-w-[70%]
                  ${msg.sender === currentUser.username 
                    ? 'bg-blue-100 text-right' 
                    : 'bg-green-100 text-left'}
                `}>
                  <strong className={`text-sm block mb-1 ${
                    msg.sender === currentUser.username ? 'text-blue-700' : 'text-green-700'
                  }`}>
                    {msg.sender === currentUser.username ? 'You' : msg.sender}
                  </strong>
                  <span className="text-gray-800">{msg.message}</span>
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
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

export default StudentChatApp;