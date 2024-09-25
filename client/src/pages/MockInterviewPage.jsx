import React, { useState, useRef } from "react";
import { FaCamera, FaMicrophone, FaStop } from "react-icons/fa";

const jobRoles = [
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Data Scientist" },
  { id: 3, title: "Product Manager" },
];

const mockQuestions = [
  { id: 1, question: "Can you explain your approach to solving complex technical problems?", correctAnswer: "I break down the problem into smaller, manageable parts, research potential solutions, and systematically implement and test each part." },
  { id: 2, question: "How do you stay updated with the latest technologies in your field?", correctAnswer: "I regularly read tech blogs, attend webinars, participate in online courses, and contribute to open-source projects to stay current with industry trends." },
  { id: 3, question: "Describe a challenging project you've worked on and how you overcame obstacles.", correctAnswer: "I led a team in developing a high-traffic web application. We faced scalability issues, which we resolved by implementing a microservices architecture and optimizing database queries." },
];

const MockInterviewPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experience, setExperience] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cameraStream, setCameraStream] = useState(null); // Manage camera stream

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startInterview = () => {
    setIsInterviewStarted(true);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream); // Store the stream in state
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach(track => track.stop()); // Stop all the tracks in the stream
      setCameraStream(null); // Clear the camera stream state
    }
  };

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);

        const audioChunks = [];
        mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          setUserAnswers([...userAnswers, { questionId: currentQuestionIndex + 1, audioUrl }]);
        });
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateScore = () => {
    return Math.floor(Math.random() * 11);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Technical Mock Interview</h1>

      {!isInterviewStarted ? (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md ">
          <div>
            <label htmlFor="jobRole" className="block mb-2 font-semibold">Select Job Role:</label>
            <select
              id="jobRole"
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a role</option>
              {jobRoles.map((role) => (
                <option key={role.id} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="experience" className="block mb-2 font-semibold">Years of Experience:</label>
            <input
              type="number"
              id="experience"
              className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={startInterview}
          >
            Start Technical Interview
          </button>
        </div>
      ) : showResults ? (
        <div className="space-y-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center text-blue-600">Interview Results</h2>
          <p className="text-2xl text-center">Your score: <span className="font-bold text-green-600">{calculateScore()} / 10</span></p>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Your Answers:</h3>
            {userAnswers.map((answer, index) => (
              <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg">
                <p className="font-semibold text-lg text-blue-700 mb-2">{mockQuestions[index].question}</p>
                <audio src={answer.audioUrl} controls className="w-full mb-4" />
                <p className="mb-2"><strong>Sample Answer:</strong> {mockQuestions[index].correctAnswer}</p>
                <p className="text-green-600"><strong>Feedback:</strong> Good attempt! Consider providing more specific technical examples and focusing on your problem-solving approach in your answer.</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-blue-600">Technical Question {currentQuestionIndex + 1}</h2>
            
            {/* Toggle Camera Button */}
            {cameraStream ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                onClick={closeCamera}
              >
                Close Camera
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={openCamera}
              >
                <FaCamera className="inline mr-2" /> Open Camera
              </button>
            )}
          </div>

          <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 bg-black rounded-lg" />

          <p className="text-xl font-medium">{mockQuestions[currentQuestionIndex].question}</p>

          {!isRecording ? (
            <button
              className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
              onClick={startRecording}
            >
              <FaMicrophone className="inline mr-2" /> Start Recording
            </button>
          ) : (
            <button
              className="w-full bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              onClick={stopRecording}
            >
              <FaStop className="inline mr-2" /> Stop Recording
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
