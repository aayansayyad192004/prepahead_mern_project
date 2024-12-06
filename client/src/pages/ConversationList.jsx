import React, { useState, useEffect } from "react";

// Make sure you include the ZEGOCLOUD SDK script in your public/index.html
// <script src="https://unpkg.com/@zegocloud/zego-chat-sdk/dist/zego-chat-sdk.min.js"></script>

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Call ZEGOCLOUD API to fetch conversations
    const fetchConversations = async () => {
      const response = await fetch('/api/conversations'); // replace with actual endpoint
      const data = await response.json();
      setConversations(data);
    };

    fetchConversations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">Your Conversations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-center">No conversations available.</p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-2xl text-white mb-4">{conversation.name}</h2>
              <div className="text-gray-400 mb-6">
                <p>{conversation.latestMessage}</p>
                <span className="text-gray-500 text-sm">{conversation.timestamp}</span>
              </div>
              <button className="text-blue-400 hover:text-blue-500 transition-all duration-300">
                Open Conversation
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
