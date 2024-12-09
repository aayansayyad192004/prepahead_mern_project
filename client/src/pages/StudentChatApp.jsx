import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:10000'); // Replace with your backend URL

const StudentChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [mentor, setMentor] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { mentorId } = useParams(); // Extract mentorId from URL

  useEffect(() => {
    // Fetch mentor details
    const fetchMentorInfo = async () => {
      try {
        const response = await fetch(`http://localhost:10000/api/mentors/${mentorId}`);
        if (!response.ok) {
          throw new Error('Error fetching mentor');
        }
        const mentorData = await response.json();
        setMentor(mentorData);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      }
    };

    // Fetch chat messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:10000/api/chat/messages?sender=${currentUser.username}&receiver=${mentorId}`
        );
        if (!response.ok) {
          throw new Error('Error fetching messages');
        }
        const messagesData = await response.json();
        console.log('Fetched messages:', messagesData); // Debugging log
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMentorInfo();
    fetchMessages();

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      console.log('Received message:', newMessage); // Debugging log
      if (
        (newMessage.receiver === currentUser.username && newMessage.sender === mentor.username) ||
        (newMessage.receiver === mentor.username && newMessage.sender === currentUser.username)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [mentorId, currentUser.username]);

  const handleSendMessage = async () => {
    if (message.trim() && currentUser) {
      const messageData = {
        message,
        sender: currentUser.username,
        receiver: mentorId,
      };

      try {
        // Emit the message to the socket
        socket.emit('sendMessage', messageData);

        // Send the message to the backend API to store in the database
        const response = await fetch('http://localhost:10000/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error('Error saving message');
        }

        const savedMessage = await response.json();
        console.log('Saved message:', savedMessage); // Debugging log
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
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
            src={mentor.profilePicture}
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
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  msg.sender === currentUser.username ? 'justify-end' : 'justify-start'
                }`}
              >
                <strong className={`text-${msg.sender === currentUser.username ? 'green' : 'blue'}-500`}>
                  {msg.sender}:
                </strong>

                <span className="text-gray-700">{msg.message}</span>
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
