import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get conversationId from URL

const MessageList = () => {
  const { conversationId } = useParams(); // Get conversation ID from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch messages dynamically from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${conversationId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId]); // Fetch messages whenever conversationId changes

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage }),
      });

      const data = await response.json();
      setMessages([...messages, data]); // Update the UI with the new message
      setNewMessage(''); // Clear the message input
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">Messages</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start mb-4">
              <div className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm max-w-xs">
                {message.text}
              </div>
              <span className="text-gray-400 ml-2 text-xs">{message.timestamp}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center mt-6">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="bg-gray-700 text-white rounded-lg p-4 flex-grow"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-500 text-white rounded-lg px-6 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageList;
