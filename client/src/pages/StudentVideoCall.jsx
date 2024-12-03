import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StudentVideoCall = () => {
  const { roomID } = useParams(); // Get roomID from URL params
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [sharableLink, setSharableLink] = useState(""); // State for storing the sharable link
  const [loading, setLoading] = useState(true); // State to track the loading status
  const navigate = useNavigate();

  useEffect(() => {
    // Generate the sharable link once the component is mounted
    const currentLink =
      window.location.protocol +
      "//" +
      window.location.host +
      `/video-call/${roomID}`; // Modified format to use path instead of query
    setSharableLink(currentLink);

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
    script.onload = () => {
      initializeZegoSDK();
      setLoading(false); // Set loading to false once the script is loaded
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [roomID]);

  const initializeZegoSDK = () => {
    const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "userName" + userID;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#root"),
      sharedLinks: [
        {
          name: "Personal link",
          url: sharableLink, // Ensure sharableLink is set before initializing SDK
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 50,
      layout: "Auto",
      showLayoutButton: true,
    });
  };

  const handleLeaveRoom = () => {
    setShowLeaveModal(true); // Show confirmation modal
  };

  const confirmLeave = () => {
    setShowLeaveModal(false);
    const mentorId = new URLSearchParams(window.location.search).get("mentorId");
    navigate(`/connectnow/${mentorId || "defaultMentorId"}`); // Navigate to the corresponding ConnectNow page
  };

  const cancelLeave = () => {
    setShowLeaveModal(false); // Close the modal
  };

  const handleCopyLink = () => {
    if (sharableLink) {
      navigator.clipboard.writeText(sharableLink);
      alert("Link copied to clipboard!");
    } else {
      alert("Sharable link is not available yet.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="container mx-auto max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg relative">
        {/* Leave Room Button */}
        <button
          onClick={handleLeaveRoom}
          className="absolute top-4 left-4 text-white bg-blue-500 rounded-full p-2 hover:bg-blue-400 transition-all duration-300"
        >
          &larr; Leave Room
        </button>

        {/* Zego Video Call Container */}
        <div id="root"></div>

        {/* Show Sharable Link */}
        {!loading && sharableLink && (
          <div className="mt-4 text-center">
            <p className="text-white text-lg mb-2">Share this link with others:</p>
            <div className="flex justify-center items-center space-x-4">
              <a
                href={sharableLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {sharableLink}
              </a>
              <button
                onClick={handleCopyLink}
                className="text-white bg-blue-500 p-2 rounded-lg hover:bg-blue-400"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Leave the Room</h2>
            <p className="mb-6">Are you sure you want to leave the room?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLeave}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmLeave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVideoCall;
