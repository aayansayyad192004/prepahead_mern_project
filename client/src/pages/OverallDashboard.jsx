import React, { useState, useEffect } from 'react';

const OverallDashboard = ({ currentUser }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch interview data from the backend
  const fetchInterviewData = async () => {
    try {
      const response = await fetch('/api/get-interviews');
      if (!response.ok) {
        throw new Error('Failed to fetch interview data');
      }
      const data = await response.json();
      
      // Sort interviews by score in descending order
      const sortedInterviews = data.sort((a, b) => (b.score || 0) - (a.score || 0));
      
      setInterviews(sortedInterviews);
    } catch (err) {
      console.error('Error fetching interview data:', err);
      setError('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchInterviewData();
  }, []);

  // Find current user's rank and performance
  const getUserRank = () => {
    return interviews.findIndex(interview => 
      interview.userId === currentUser?._id
    ) + 1;
  };

  // Calculate overall stats
  const calculateStats = () => {
    const totalInterviews = interviews.length;
    const avgScore = interviews.reduce((acc, interview) => 
      acc + (interview.score || 0), 0) / totalInterviews || 0;
    
    return { totalInterviews, avgScore: avgScore.toFixed(2) };
  };

  const { totalInterviews, avgScore } = calculateStats();
  const userRank = getUserRank();

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-indigo-100 to-indigo-300 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-semibold text-gray-800">Interview Leaderboard</h2>
        <button
          onClick={fetchInterviewData}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          Refresh Leaderboard
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Total Interviews</h3>
          <p className="text-3xl font-bold text-blue-600">{totalInterviews}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">{avgScore}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Rank</h3>
          <p className="text-3xl font-bold text-purple-600">
            {userRank > 0 ? `#${userRank}` : 'Not Ranked'}
          </p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interviews.map((interview, index) => (
              <tr 
                key={interview._id} 
                className={`
                  ${interview.userId === currentUser?._id 
                    ? 'bg-yellow-100 font-bold' 
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{interview.selectedRole}</td>
                <td className="px-6 py-4 whitespace-nowrap">{interview.experience} years</td>
                <td className="px-6 py-4 whitespace-nowrap">{interview.score || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mt-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md mt-6">
          Loading leaderboard...
        </div>
      )}
    </div>
  );
};

export default OverallDashboard;