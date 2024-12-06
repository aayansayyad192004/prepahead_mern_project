import React, { useState, useEffect } from "react";

const MessageList = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages/${conversationId}`); // Fetch messages for a specific conversation
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [conversationId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
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
    </div>
  );
};

export default MessageList;
