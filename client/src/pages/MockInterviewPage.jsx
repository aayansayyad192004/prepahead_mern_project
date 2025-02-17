import React, { useState, useRef, useEffect } from "react";
import { FaCamera, FaMicrophone, FaStop } from "react-icons/fa";
import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useSelector } from 'react-redux'; // Add this line at the top

const jobRoles = [
  { "id": 1, "title": "Software Engineer" },
  { "id": 2, "title": "Frontend Developer" },
  { "id": 3, "title": "Backend Developer" },
  { "id": 4, "title": "Full Stack Developer" },
  { "id": 5, "title": "Data Scientist" },
  { "id": 6, "title": "Machine Learning Engineer" },
  { "id": 7, "title": "DevOps Engineer" },
  { "id": 8, "title": "QA Engineer" },
  { "id": 9, "title": "UI/UX Designer" },
  { "id": 10, "title": "Mobile App Developer" },
  { "id": 11, "title": "Cloud Engineer" },
  { "id": 12, "title": "Product Manager" },
  { "id": 13, "title": "Cybersecurity Analyst" },
  { "id": 14, "title": "Business Analyst" },
  { "id": 15, "title": "System Administrator" },
  { "id": 16, "title": "Network Engineer" },
  { "id": 17, "title": "Database Administrator" },
  { "id": 18, "title": "Game Developer" },
  { "id": 19, "title": "Software Architect" },
  { "id": 20, "title": "Technical Support Engineer" },
  { "id": 21, "title": "IT Consultant" },
  { "id": 22, "title": "Blockchain Developer" },
  { "id": 23, "title": "Site Reliability Engineer" },
  { "id": 24, "title": "Artificial Intelligence Engineer" },
  { "id": 25, "title": "Embedded Systems Engineer" },
  { "id": 26, "title": "Ethical Hacker" },
  { "id": 27, "title": "Data Engineer" },
  { "id": 28, "title": "Network Administrator" },
  { "id": 29, "title": "Application Support Engineer" },
  { "id": 30, "title": "Technical Writer" }
];

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // For Vite
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const MockInterviewPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experience, setExperience] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedRole || !experience) return;

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const chatSession = await model.startChat({
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            
          },
          history: [
            {
              role: "user",
              parts: [
                {
                  text: `Job Position: ${selectedRole}, Year of experience: ${experience}. Based on this information, please give me 5 interview questions with answers in JSON format. Include 'Question' and 'Answer' fields.`,
                },
              ],
            },
          ],
        });

        const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
        let rawResponse = result.response.text();
        rawResponse = rawResponse.replace(/```json|```/g, "").trim();
        const questions = JSON.parse(rawResponse);
        setQuestions(questions);
  
      } catch (error) {
        console.error("Error fetching questions from Gemini:", error);
        try {
          const fallbackResponse = await axios.get(`/api/questions/${selectedRole}`);
          setQuestions(fallbackResponse.data);
        } catch (fallbackError) {
          console.error("Error fetching fallback questions:", fallbackError);
        }
      }
    };

    fetchQuestions();
  }, [selectedRole, experience]);

  const startInterview = () => {
    setIsInterviewStarted(true);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
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
      tracks.forEach(track => track.stop());
      setCameraStream(null);
    }
  };

    // Speech recognition handlers
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
    
          mediaRecorderRef.current.addEventListener("stop", async () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            setUserAnswers(prevAnswers => [
              ...prevAnswers,
              { questionId: currentQuestionIndex, audioUrl }
            ]);
    
            // Convert audio to text and evaluate with Gemini
            try {
              const transcription = await transcribeAudio(audioBlob);
              setTranscriptions(prev => {
                const newTranscriptions = [...prev];
                newTranscriptions[currentQuestionIndex] = transcription; // Ensure transcription matches question
                return newTranscriptions;
              });
            } catch (error) {
              console.error("Transcription error:", error);
            }
          });
    
          // Stop ongoing recognition before starting new one
          recognition.stop();
    
          // Start speech recognition
          recognition.start();  // Starts the speech recognition
        })
        .catch((error) => console.error("Error accessing microphone:", error));
    };
    const { currentUser } = useSelector((state) => state.user); 

    const transcribeAudio = (audioBlob) => {
      return new Promise((resolve, reject) => {
        // One handler for recognition.onresult
        recognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          resolve(transcript); // Capture transcript and resolve it
        };
    
        recognition.onerror = (event) => {
          if (event.error === 'no-speech') {
            console.warn("No speech detected.");
          } else {
            console.error("Speech recognition error:", event.error);
          }
          reject(event.error);
        };
      });
    };
    
    const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        recognition.stop();  // Stops the speech recognition
    
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          calculateScore();
          setShowResults(true);
        }
      }
    };
    
    recognition.onresult = (event) => {
      const latestTranscript = event.results[0][0].transcript;
      setTranscriptions(prevTranscriptions => [...prevTranscriptions, latestTranscript]);  // Update the transcript with the latest result
    };

    const calculateScore = () => {
      let totalScore = 0;
    
      const calculatedAnswers = userAnswers.map((answer, index) => {
        const correctAnswer = questions[index]?.Answer || "";
        const userTranscript = transcriptions[index] || "";
        
        // Calculate similarity
        const similarityScore = calculateSimilarity(userTranscript, correctAnswer);
    
        // Understanding score calculation
        let understandingScore = 0;
        const keyConcepts = correctAnswer.toLowerCase()
          .split(/[.,!?]/)
          .flatMap(sentence => sentence.split(' '))
          .filter(word => word.length > 3) 
          .map(word => word.trim());
    
        keyConcepts.forEach(concept => {
          if (userTranscript.toLowerCase().includes(concept.toLowerCase())) {
            understandingScore += 2;
          }
        });
    
        const normalizedUnderstandingScore = Math.min(5, (understandingScore / (keyConcepts.length * 2)) * 10);
        
        // Final question score
        const questionScore = Math.round((similarityScore * 6 + normalizedUnderstandingScore * 4) / 10 * 10);
    
        totalScore += questionScore;
    
        return { ...answer, similarityScore: questionScore };
      });
    
      const finalScore = Math.round((totalScore / (questions.length * 10)) * 10);
    
      let bonusPoints = 0;
      if (calculatedAnswers.every(answer => answer.similarityScore >= 7)) {
        bonusPoints = 1;
      }
    
      const updatedScore = Math.min(10, finalScore + bonusPoints);
    
      // ✅ Pass updatedScore instead of relying on outdated state
      saveInterviewData(updatedScore, calculatedAnswers);
    
      // ✅ Update UI state (this will be reflected in the next render)
      setScore(updatedScore);
      setUserAnswers(calculatedAnswers);
    };
    
    // ✅ Modify saveInterviewData to accept the updated score
    const saveInterviewData = async (updatedScore, updatedAnswers) => {
      try {
        const interviewData = {
          userId: currentUser._id, // Add user ID
          username: currentUser.username, // Add username
          selectedRole,
          experience,
          questions,
          userAnswers: updatedAnswers,
          score: updatedScore  // ✅ Pass latest score value
        };
    
        const response = await axios.post('/api/save-interview', interviewData);
        console.log('Interview data saved:', response.data);
      } catch (error) {
        console.error('Error saving interview data:', error);
      }
    };
       
  
    // Improved similarity calculation function
    const calculateSimilarity = (text1, text2) => {
      if (!text1 || !text2) return 0;
    
      // Normalize texts
      const normalize = (text) => text.toLowerCase()
        .replace(/[.,!?]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(word => word.length > 2);
    
      const words1 = normalize(text1);
      const words2 = normalize(text2);
      
      // Calculate word overlap with higher weight for matches
      const uniqueWords = new Set([...words1, ...words2]);
      const intersection = words1.filter(word => words2.includes(word)).length;
      
      // Base similarity score with higher weight
      let similarityScore = (intersection / uniqueWords.size) * 1.2;
      
      // Enhanced bonus points for sequence matching
      const sequence = words2.join(' ');
      const userSequence = words1.join(' ');
      
      // Check for partial matches in sequences
      const sequences = sequence.split(' ').filter(s => s.length > 4);
      sequences.forEach(seq => {
        if (userSequence.includes(seq)) {
          similarityScore += 0.15; // Increased bonus for matching sequences
        }
      });
      
      // Bonus for answer length being similar to expected answer
      const lengthRatio = Math.min(words1.length, words2.length) / Math.max(words1.length, words2.length);
      similarityScore += lengthRatio * 0.3; // Increased weight for length similarity
      
      // Additional bonus for having similar word count
      if (Math.abs(words1.length - words2.length) <= 5) {
        similarityScore += 0.2;
      }
      
      // Ensure score is between 0 and 1 with more generous upper limit
      return Math.min(1, similarityScore * 1.2); // 20% boost to final similarity score
    }
   
    
    
    const getFeedback = (index) => {
      return userAnswers[index]?.feedback || "Consider revisiting the topic for better clarity.";
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

          <h1 className="text-3xl font-semibold text-center text-blue-600">

            Mock Interview Result for <span className="text-blue-800">{currentUser?.username}</span>

        </h1> 

          <p className="text-2xl text-center">Your score: <span className="font-bold">{score}</span></p>

          <ul className="space-y-4">

            {userAnswers.map((answer, index) => (

              <li key={index} className="bg-gray-200 p-4 rounded-md">

                <p><strong>Question:</strong> {questions[index]?.Question}</p>

                <audio controls src={answer.audioUrl} />

                <p className="mb-2  text-red-600"><strong>Your Answer:</strong> {transcriptions[index]}</p>

                <p className="mb-2  text-green-600"><strong>Sample Answer:</strong> {questions[index]?.Answer}</p>

                <p className="mb-2  text-blue-600"><strong>Feedback:</strong> {getFeedback(index)}</p>

              </li>

            ))}

          </ul>

          <button

            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"

            onClick={() => window.location.reload()}

          >

            Retake Interview

          </button>

        </div>

      ) : (

        <div className="bg-white p-6 rounded-lg shadow-md">

          <h2 className="text-3xl font-semibold mb-4">Interview Questions</h2>

          <p className="mb-4">{questions[currentQuestionIndex]?.Question}</p>

          <div className="flex items-center space-x-4">

            <button

              onClick={openCamera}

              className="bg-green-500 text-white p-2 rounded-md"

            >

              <FaCamera />

            </button>

            <button

              onClick={isRecording ? stopRecording : startRecording}

              className={`bg-red-500 text-white p-2 rounded-md ${isRecording ? "hover:bg-red-600" : "hover:bg-red-400"}`}

            >

              {isRecording ? <FaStop /> : <FaMicrophone />}

            </button>

          </div>

          <video ref={videoRef} autoPlay muted className="mt-4" />

          {isRecording && <p className="mt-2 text-sm text-gray-600">Recording your answer...</p>}

        </div>

      )}

    </div>

  );

};



export default MockInterviewPage;