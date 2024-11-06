import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

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

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const CourseRecommendations = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skillQuery, setSkillQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState({ status: "idle", data: [], error: null });
  const [youtubeCourses, setYoutubeCourses] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Retrieve data from localStorage on component mount
  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    const savedExperience = localStorage.getItem("experience");
    const savedSkillQuery = localStorage.getItem("skillQuery");
    const savedShowRecommendations = localStorage.getItem("showRecommendations") === "true";

    if (savedRole) setSelectedRole(savedRole);
    if (savedExperience) setExperience(savedExperience);
    if (savedSkillQuery) setSkillQuery(savedSkillQuery);
    setShowRecommendations(savedShowRecommendations);
  }, []);

  // Update localStorage whenever selectedRole, experience, skillQuery, or showRecommendations changes
  useEffect(() => {
    localStorage.setItem("selectedRole", selectedRole);
    localStorage.setItem("experience", experience);
    localStorage.setItem("skillQuery", skillQuery);
    localStorage.setItem("showRecommendations", showRecommendations);
  }, [selectedRole, experience, skillQuery, showRecommendations]);

  useEffect(() => {
    const fetchYoutubeCourses = async () => {
      if (!skillQuery && (!selectedRole || !experience)) return;

      try {
        const query = skillQuery || `${selectedRole} roadmap OR DSA OR skills`;
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: "snippet",
            maxResults: 5,
            q: query,
            key: YOUTUBE_API_KEY,
            type: "video",
            videoEmbeddable: "true"
          },
        });

        const courses = response.data.items.map((item) => ({
          title: item.snippet.title,
          description: item.snippet.description,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.high.url,
        }));

        setYoutubeCourses(courses);
      } catch (error) {
        setYoutubeCourses([{ error: "Error fetching YouTube courses. Please try again later." }]);
      }
    };

    fetchYoutubeCourses();
  }, [skillQuery, selectedRole, experience]);

  const handleGetRecommendations = () => {
    setShowRecommendations(true);
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const handleBack = () => {
    setShowRecommendations(false);
  };

  const RecommendationItem = ({ title, platform, duration, link }) => (
    <li className="bg-gray-100 p-4 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p><strong>Platform:</strong> {platform}</p>
      <p><strong>Duration:</strong> {duration}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200">
        View Course
      </a>
    </li>
  );

  RecommendationItem.propTypes = {
    title: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-center text-blue-700">Course Recommendations</h1>

      {!showRecommendations ? (
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 max-w-xl mx-auto border border-gray-200">
          <div>
            <label htmlFor="skillQuery" className="block mb-2 font-medium text-gray-700">Enter Skill/Topic:</label>
            <input
              type="text"
              id="skillQuery"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="e.g., React.js, Machine Learning, etc."
            />
          </div>

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

          <h2 className="text-4xl font-semibold text-blue-700">YouTube Courses for "{skillQuery || selectedRole}"</h2>
          <ul className="space-y-6 ">
            {youtubeCourses.length > 0 ? (
              youtubeCourses.map((course, index) => (
                <li key={index} className="bg-gray-50 p-4  rounded-md shadow-sm flex items-center hover:shadow-lg transition-shadow duration-300">
                  {course.thumbnail && !selectedVideoId && (
                    <img src={course.thumbnail} alt={course.title} className="w- h-32 mr-4 rounded-lg shadow-md" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    {selectedVideoId === course.videoId ? (
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${course.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="mt-4 rounded"
                      ></iframe>
                    ) : (
                      <button
                        onClick={() => handleVideoClick(course.videoId)}
                        className="mt-1 w-5.5 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        Watch Video
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">No YouTube courses found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations;
