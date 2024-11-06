import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import PropTypes from "prop-types";

const jobRoles = [
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Data Scientist" },
  { id: 3, title: "Product Manager" },
  { id: 4, title: "Web Developer" },
  { id: 5, title: "Data Analyst" },
];

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // For Vite

const JobRecommendations = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState({ status: "idle", data: [], error: null });

  const fetchRecommendations = async () => {
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
          responseMimeType: "text/plain",
        },
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Please provide current job openings based on the following criteria: Job Position: ${selectedRole}, Years of Experience: ${experience}, Location: ${location}, Technologies: ${technologies}, Company Type: ${companyType}. Please provide details such as job title, company name, location, job description, and application link.`,
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
      const rawResponse = await result.response.text();

      // Process the response to extract job recommendations
      const formattedRecommendations = rawResponse.split("\n").filter(item => item).map(item => item.trim());
      const jobRecommendations = formattedRecommendations.map(rec => {
        const [title, description, link] = rec.split("|"); // Assuming your response format is title|description|link
        return { title, description, link: link || "#" }; // Default to "#" if link is undefined
      });
      setRecommendations({ status: "success", data: jobRecommendations });
    } catch (error) {
      console.error("Error fetching recommendations from Gemini:", error);
      setRecommendations({ status: "error", error: "Error fetching job recommendations." });
    }
  };

  useEffect(() => {
    if (showRecommendations) {
      fetchRecommendations();
    }
  }, [showRecommendations, selectedRole, experience, location, technologies, companyType]);

  const handleGetRecommendations = () => {
    setShowRecommendations(true);
  };

  const handleBack = () => {
    setShowRecommendations(false);
  };

  const RecommendationItem = ({ title, description, link }) => (
    <li className="bg-gray-100 p-4 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p>{description || "No description provided."}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200">
        Apply Now
      </a>
    </li>
  );

  RecommendationItem.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.string.isRequired,
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-center text-blue-700">Job Recommendations</h1>

      {!showRecommendations ? (
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-xl mx-auto border border-gray-200">
          <div>
            <label htmlFor="jobRole" className="block mb-2 font-medium text-gray-700">Select Job Role:</label>
            <select
              id="jobRole"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a job role</option>
              {jobRoles.map((role) => (
                <option key={role.id} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="experience" className="block mb-2 font-medium text-gray-700">Years of Experience:</label>
            <input
              type="number"
              id="experience"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label htmlFor="location" className="block mb-2 font-medium text-gray-700">Location:</label>
            <input
              type="text"
              id="location"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, CA"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block mb-2 font-medium text-gray-700">Technologies:</label>
            <input
              type="text"
              id="technologies"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g., React, Node.js"
            />
          </div>

          <div>
            <label htmlFor="companyType" className="block mb-2 font-medium text-gray-700">Company Type:</label>
            <input
              type="text"
              id="companyType"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              placeholder="e.g., Startup, Corporation"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={handleGetRecommendations}
          >
            Get Recommendations
          </button>
        </div>
      ) : (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto border border-gray-200">
          <button
            className="w-10.5 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={handleBack}
          >
            &larr; Back
          </button>

          <h2 className="text-4xl font-semibold text-blue-700">Job Recommendations</h2>
          <ul className="space-y-6">
            {recommendations.status === "success" ? (
              recommendations.data.map((rec, index) => (
                <RecommendationItem key={index} title={rec.title} description={rec.description} link={rec.link} />
              ))
            ) : (
              <li className="text-center text-gray-500">{recommendations.error || "No job recommendations found."}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
