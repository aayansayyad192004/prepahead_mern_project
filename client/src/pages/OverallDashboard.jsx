import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const OverallDashboard = ({ currentUser }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  // Get user data from Redux store
  const { currentUser: reduxUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (reduxUser) {
      setUserData(reduxUser);
    }
  }, [reduxUser]);

  const fetchInterviewData = async () => {
    try {
      const response = await fetch("/api/get-interviews");
      if (!response.ok) {
        throw new Error("Failed to fetch interview data");
      }
      const data = await response.json();
      setInterviews(data.sort((a, b) => (b.score || 0) - (a.score || 0)));
    } catch (err) {
      console.error("Error fetching interview data:", err);
      setError("Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewData();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-indigo-50 to-indigo-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-indigo-900">Dashboard</h2>
        <button
          onClick={fetchInterviewData}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105"
        >
          Refresh Data
        </button>
      </div>

      {/* Profile UI */}
      {/* Profile UI */}
{userData && (
  <div className="bg-white p-8 rounded-xl shadow-2xl mb-8">
    <h3 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Your Profile</h3>

    <div className="flex items-center gap-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <img
          src={userData?.profilePicture || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"}
          alt="Profile"
          className="ml-40 w-48 h-48 rounded-full shadow-lg border-4 border-indigo-200"
        />
      </div>

         {/* Profile Middle - Details */}
         <div className="space-y-6 items-center ml-40 mr-10">
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Email:</strong> {userData?.email || "N/A"}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Phone:</strong> {userData?.phone || "N/A"}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Address:</strong> {userData?.address || "N/A"}</p>
              </div>
            </div>

            {/* Profile Right - Career */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Job Niche 1:</strong> {userData?.jobNiche1 || "N/A"}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Job Niche 2:</strong> {userData?.jobNiche2 || "N/A"}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <p className="text-lg text-gray-700"><strong>Job Niche 3:</strong> {userData?.jobNiche3 || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* LeaderBoard Heading */}
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-indigo-900">LeaderBoard</h3>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-900">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-bold text-yellow-100 uppercase tracking-wider">Rank</th>
              <th className="px-8 py-4 text-left text-sm font-bold text-yellow-100 uppercase tracking-wider">Name</th>
              <th className="px-8 py-4 text-left text-sm font-bold text-yellow-100 uppercase tracking-wider">Role</th>
              <th className="px-8 py-4 text-left text-sm font-bold text-yellow-100 uppercase tracking-wider">Experience</th>
              <th className="px-8 py-4 text-left text-sm font-bold text-yellow-100 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview, index) => (
              <tr
                key={interview._id}
                className={`${
                  interview.userId === currentUser?._id ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"
                } transition duration-200`}
              >
                <td className="px-8 py-4 whitespace-nowrap text-lg text-gray-700">{index + 1}</td>
                <td className="px-8 py-4 whitespace-nowrap text-lg text-gray-700">{interview.username || "Unknown"}</td>
                <td className="px-8 py-4 whitespace-nowrap text-lg text-gray-700">{interview.selectedRole}</td>
                <td className="px-8 py-4 whitespace-nowrap text-lg text-gray-700">{interview.experience} years</td>
                <td className="px-8 py-4 whitespace-nowrap text-lg text-gray-700">{interview.score || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mt-8">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md mt-8">
          Loading data...
        </div>
      )}
    </div>
  );
};

export default OverallDashboard;