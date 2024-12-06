import React, { useState, useEffect } from "react";

// Make sure you include the ZEGOCLOUD SDK script in your public/index.html
// <script src="https://unpkg.com/@zegocloud/zego-chat-sdk/dist/zego-chat-sdk.min.js"></script>

const ConversationList = ({ mentorId, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdkInstance, setSdkInstance] = useState(null);  // To store SDK instance

  // Fetching and initializing ZEGOCLOUD SDK
  useEffect(() => {
    const initZegoChat = async () => {
      try {
        const appID = import.meta.env.VITE_CHAT_ZEGO_APP_ID; // Replace with your AppID
        const appKey = import.meta.env.VITE_CHAT_ZEGO_SERVER_SECRET_KEY; // Replace with your AppKey

        // Initialize the ZEGOCLOUD chat SDK (global object from CDN)
        const sdk = new window.ZegoChatSDK(appID, appKey);
        setSdkInstance(sdk);

        // If there's a mentorId, fetch the conversations
        if (mentorId) {
          const response = await fetch(`/api/conversations/${mentorId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch conversations");
          }
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error initializing ZEGOCLOUD SDK or fetching conversations:", error);
        setError(error.message);

        // Fallback mock data in case of error
        const mockData = [
          { id: `chat_${mentorId}_1`, name: "Previous Conversation 1" },
          { id: `chat_${mentorId}_2`, name: "Previous Conversation 2" },
        ];
        setConversations(mockData);
      } finally {
        setLoading(false);
      }
    };

    initZegoChat();

    return () => {
      // Logout on unmount if necessary
      if (sdkInstance) {
        sdkInstance.logout();
      }
    };
  }, [mentorId, sdkInstance]);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      {loading ? (
        <p className="text-gray-400 text-center">Loading conversations...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className="cursor-pointer p-4 hover:bg-gray-700 rounded-lg transition-all duration-300"
              >
                {conversation.name}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No conversations yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
