
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const Roadmap = () => {
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('selectedRole') || "");
  const [preferredTimeline, setPreferredTimeline] = useState(localStorage.getItem('preferredTimeline') || "");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Load roadmap from localStorage if it exists
    const savedRoadmap = localStorage.getItem('roadmap');
    if (savedRoadmap) {
      setRoadmap(JSON.parse(savedRoadmap));
    }
  }, []);

  const generateRoadmap = async () => {
    if (!selectedRole || !preferredTimeline) return;

    try {
      setLoading(true);
      setError(null);
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
                text: `Generate a career roadmap for the role of ${selectedRole} with a preferred timeline of ${preferredTimeline} months. Provide output in strict JSON format only, following this structure: { "roadmap": [ { "step": "string", "description": "string", "timeline": "string" } ] }`,
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage("Please provide roadmap.");
      let rawResponse = result.response.text();
      rawResponse = rawResponse.replace(/```json|```/g, "").trim();
      const jsonMatch = rawResponse.match(/{[^]*}/);

      if (jsonMatch) {
        const rawJson = jsonMatch[0];
        const roadmapData = JSON.parse(rawJson);
        setRoadmap(roadmapData);

        // Save data to localStorage
        localStorage.setItem('roadmap', JSON.stringify(roadmapData));
        localStorage.setItem('selectedRole', selectedRole);
        localStorage.setItem('preferredTimeline', preferredTimeline);
      } else {
        console.error("No JSON found in response text:", rawResponse);
        setError("Received an unexpected response format without JSON data.");
      }

    } catch (error) {
      console.error("Error fetching roadmap from Gemini:", error);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Career Roadmap", 14, 20);
    let yOffset = 30;

    if (roadmap && roadmap.roadmap) {
      roadmap.roadmap.forEach((step, index) => {
        doc.setFontSize(14);
        const stepTitle = `Step ${index + 1}: ${step.step}`;
        if (yOffset + 10 > doc.internal.pageSize.height) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(stepTitle, 14, yOffset);
        yOffset += 10;

        doc.setFontSize(12);
        const timelineText = `Timeline: ${step.timeline}`;
        if (yOffset + 6 > doc.internal.pageSize.height) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(timelineText, 14, yOffset);
        yOffset += 6;

        const descriptionLines = doc.splitTextToSize(step.description, 180);
        descriptionLines.forEach((line) => {
          if (yOffset + 6 > doc.internal.pageSize.height) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(line, 14, yOffset);
          yOffset += 6;
        });
      });
    }

    doc.save("career_roadmap.pdf");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen max-w-7xl">
      <h1 className="text-5xl font-bold mb-8 text-center text-blue-800">Career Roadmap </h1>
     
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-full mx-auto mb-8 border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Generate Your Roadmap</h2>
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Job Role:</label>
          <input
            type="text"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Developer"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Preferred Timeline (months):</label>
          <input
            type="number"
            value={preferredTimeline}
            onChange={(e) => setPreferredTimeline(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 8"
          />
        </div>
        <button
          onClick={generateRoadmap}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Roadmap
        </button>
       
      </div>

      {loading && <p className="text-center text-blue-600">Generating your roadmap, please wait...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {roadmap && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-full mx-auto mt-4 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Your Career Roadmap:</h3>
          <div className="space-y-6">
            {roadmap.roadmap.map((step, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-xl font-semibold">{step.step}</h4>
                <p className="text-gray-600"><strong>Timeline:</strong> {step.timeline}</p>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={downloadPDF}
            className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Download PDF
          </button>
          <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to Dashboard
        </button>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
