import React, { useState, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ConversationList = ({ mentorId, onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);

  const appID = import.meta.env.VITE_ZEGO_APP_ID;
  const appSign = import.meta.env.VITE_ZEGO_APP_SIGN_KEY;
  const serverUrl = import.meta.env.VITE_ZEGO_SERVER_URL;

  const zp = ZegoUIKitPrebuilt.create(appID, appSign, serverUrl);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Fetch conversations specific to this mentor
        const response = await fetch(`/api/conversations/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Fallback to mocked data if API fails
        const mockData = [
          { id: `chat_${mentorId}_1`, name: "Previous Conversation 1" },
          { id: `chat_${mentorId}_2`, name: "Previous Conversation 2" }
        ];
        setConversations(mockData);
      }
    };

    if (mentorId) {
      fetchConversations();
    }
  }, [mentorId]);

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
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
    </div>
  );
};

export default ConversationList;