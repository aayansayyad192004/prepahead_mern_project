import React, { useState, useRef, useEffect } from "react";
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useSelector } from 'react-redux';


import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript'; // or your preferred language
import axios from "axios";
import { GoogleGenerativeAI } from '@google/generative-ai';

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

const SkillAssessment = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experience, setExperience] = useState("");
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedRole || !experience) return;

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
                  text: `Job Position: ${selectedRole}, Year of experience: ${experience}. Please provide 10 questions: 7 MCQs and 3 coding questions in JSON format with 'Question', 'Answer', and 'Options' for MCQs. Include a 'Type' field to distinguish between MCQs and Coding questions. For each coding question, provide 2 test cases with 'Input' and 'Expected Output' in JSON format.`,
                },
              ],
            },
          ],
        });

        const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
        let rawResponse = await result.response.text();

        // Log the response to debug
        console.log("Raw Response: ", rawResponse);

        // Ensure valid JSON by cleaning the response
        rawResponse = rawResponse.replace(/```json|```|\n/g, "").trim();

        try {
          const questionsData = JSON.parse(rawResponse);
          setQuestions(
            questionsData.map((question) => ({
              ...question,
              TestCases: question.TestCases || [],
            }))
          );
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          throw parseError;
        }

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

  const startAssessment = () => {
    setIsAssessmentStarted(true);
  };
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const calculateScore = async () => {
    let totalScore = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (question.Type === "MCQ") {
        if (userAnswer === question.Answer) {
          totalScore += 1;
        }
      } else if (question.Type === "Coding") {
        if (userAnswer && userAnswer.trim().length > 0) {
          totalScore += 1;
        }
      }
    });

    setScore(totalScore);
    console.log("Current User:", currentUser);  // Debugging
  console.log("Data Sent:", {
    userId: currentUser?._id,
    username: currentUser?.username,
    role: selectedRole,
    experience,
    score: totalScore,
    answers: userAnswers,
  });
    try {

      await axios.post("/api/save-results", {
        userId: currentUser._id, // Add user ID
      username: currentUser.username, // Add username
        role: selectedRole,

        experience,

        score: totalScore,

        answers: userAnswers,

      });

      console.log("Results saved successfully!");

    } catch (error) {

      console.error("Error saving results to MongoDB:", error);

    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Technical Skill Assessment</h1>

      {!isAssessmentStarted ? (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
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
            onClick={startAssessment}
          >
            Start Technical Assessment
          </button>
        </div>
      ) : showResults ? (
        <div className="space-y-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center text-blue-600">Assessment Results</h2>
          <p className="text-2xl text-center">Your score: <span className="font-bold">{score}</span></p>
          <ul className="space-y-4">
            {userAnswers.map((answer, index) => (
              <li key={index} className="bg-gray-200 p-4 rounded-md">
                <p><strong>Question:</strong> {questions[index]?.Question}</p>
                <p className="mb-2 text-red-600"><strong>Your Answer:</strong> {answer}</p>
                <p className="mb-2 text-green-600"><strong>Sample Answer:</strong> {questions[index]?.Answer}</p>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => window.location.reload()}
          >
            Retake Assessment
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Assessment Questions</h2>
          {questions.length > 0 && (
            <>
              <p className="mb-4">{questions[currentQuestionIndex]?.Question}</p>
              {questions[currentQuestionIndex]?.Type === "MCQ" ? (
                <ul className="space-y-2">
                  {questions[currentQuestionIndex]?.Options.map((option, index) => (
                    <li key={index} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                      />
                      <label htmlFor={`option-${index}`} className="ml-2">{option}</label>
                    </li>
                  ))}
                </ul>
              ) : (
                <CodeMirror
                  value={userAnswers[currentQuestionIndex] || ""}
                  options={{
                    mode: "javascript",
                    theme: "default",
                    lineNumbers: true,
                  }}
                  onBeforeChange={(editor, data, value) => handleAnswerChange(currentQuestionIndex, value)}
                />
              )}
              {questions[currentQuestionIndex]?.Type === "Coding" && questions[currentQuestionIndex]?.TestCases.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">Test Cases</h3>
                  {questions[currentQuestionIndex].TestCases.map((testCase, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>Input:</strong> {testCase.Input}</p>
                      <p><strong>Expected Output:</strong> {testCase.ExpectedOutput}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="w-full mt-4 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={nextQuestion}
              >
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillAssessment;
