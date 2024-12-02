import React, { useState, useEffect } from 'react';

const OverallDashboard = ({ currentUser }) => {
  const [interviews, setInterviews] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch interview data from the backend
  const fetchInterviewData = async () => {
    try {
      const response = await fetch('/api/get-interviews');
      if (!response.ok) {
        throw new Error('Failed to fetch interview data');
      }
      const data = await response.json();
      setInterviews(data);
    } catch (err) {
      console.error('Error fetching interview data:', err);
      setError('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data from the backend
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/current', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data); // Store the fetched user data
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchInterviewData();
    if (currentUser && currentUser._id) {
      fetchUserData(); // Fetch user data only if currentUser._id is available
    }
  }, [currentUser]); // Re-run fetchUserData when currentUser changes

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-indigo-100 to-indigo-300 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-semibold text-gray-800">Dashboard</h2>
        <button
          onClick={fetchInterviewData}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-300"
        >
          Refresh Data
        </button>
      </div>

      {/* Loading State for interviews */}
      {loading ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md mb-6">
          Loading interview data...
        </div>
      ) : (
        <div>
          {/* Display Interview Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Interviews Card */}
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-lg shadow-xl hover:from-green-500 hover:to-teal-600 transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Total Interviews</h3>
              <div className="text-4xl font-bold text-white">{interviews.length}</div>
            </div>

            {/* Average Score Card */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-lg shadow-xl hover:from-purple-500 hover:to-pink-600 transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Average Score</h3>
              <div className="text-4xl font-bold text-white">
                {interviews.reduce((acc, interview) => acc + interview.score, 0) / interviews.length || 0}
              </div>
            </div>

            {/* Latest Interview Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-xl hover:from-yellow-500 hover:to-orange-600 transition duration-300">
              <h3 className="text-xl font-semibold text-white mb-4">Latest Interview</h3>
              <div className="text-sm font-medium text-white">
                {interviews[0] ? (
                  <>
                    <p>Role: {interviews[0].selectedRole}</p>
                    <p>Experience: {interviews[0].experience}</p>
                    <p>Score: {interviews[0].score}</p>
                  </>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Interview Details Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Interview Details</h3>
            {interviews.length === 0 ? (
              <div className="text-gray-600 text-lg">No interview data available</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-left">
                  <thead className="bg-gradient-to-r from-gray-200 to-gray-300">
                    <tr>
                      <th className="border px-6 py-3 text-sm font-medium text-gray-700">Role</th>
                      <th className="border px-6 py-3 text-sm font-medium text-gray-700">Experience</th>
                      <th className="border px-6 py-3 text-sm font-medium text-gray-700">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((interview) => (
                      <tr key={interview._id} className="hover:bg-gray-50 transition duration-200">
                        <td className="border px-6 py-4 text-sm text-gray-800">{interview.selectedRole}</td>
                        <td className="border px-6 py-4 text-sm text-gray-800">{interview.experience}</td>
                        <td className="border px-6 py-4 text-sm text-gray-800">{interviews.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mt-6">
          {error}
        </div>
      )}

      {/* User Data (If User is Fetched) */}
      {userLoading ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg shadow-md mt-6">
          Loading user data...
        </div>
      ) : userData ? (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">User Details</h3>
          <div className="text-gray-600 text-lg">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mt-6">
          Failed to load user data.
        </div>
      )}
    </div>
  );
};

export default OverallDashboard;
