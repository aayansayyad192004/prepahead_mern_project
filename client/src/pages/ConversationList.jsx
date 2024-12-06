import React, { useState, useEffect } from "react";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null); // State to store error message

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations'); // Replace with actual endpoint
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Check if the response is JSON
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error('Expected JSON but got: ' + contentType);
        }

        const data = await response.json();
        setConversations(data);
      } catch (error) {
        setError(error.message); // Set error message if something goes wrong
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-400">Your Conversations</h1>

      {error ? (
        <p className="text-red-400 text-center">{error}</p> // Display error message
      ) : (
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
      )}
    </div>
  );
};

export default ConversationList;
