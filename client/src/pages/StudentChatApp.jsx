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
    const fetchMentorInfo = async () => {
      try {
        const response = await fetch(`/api/mentor/${mentorId}`); // Fetch by mentor ID
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
    
        // Check if the data is valid and process it
        if (data && data._id) {
          setMentor(data);  // Assuming setMentor is a function that sets the mentor data
        } else {
          console.error('API response is not valid:', data);
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
      }
      };
      
    fetchMentorInfo();

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [mentorId]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const messageData = {
        message,
        userId: currentUser.username,
        mentorId,
      };

      socket.emit('sendMessage', messageData); // Emit message to backend
      setMessages((prevMessages) => [...prevMessages, messageData]); // Update local state immediately
      setMessage('');
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
          <img src={mentor.profilePicture} alt="Mentor Profile" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <p className="font-semibold">{mentor.username}</p>
            <p>{mentor.email}</p>
          </div>
        </div>

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
