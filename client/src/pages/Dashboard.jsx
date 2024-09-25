import React, { useState, useEffect } from 'react';
import { FaUser, FaChartLine, FaCode, FaMoneyBillWave, FaRobot, FaCamera, FaBookOpen, FaBriefcase } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import { SiGithub, SiLeetcode } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileSetupStep, setProfileSetupStep] = useState(1);
  const [isFocused, setIsFocused] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating camera-based focus tracking
    const focusInterval = setInterval(() => {
      setIsFocused(Math.random() > 0.2); // 80% chance of being focused
    }, 5000);

    return () => clearInterval(focusInterval);
  }, []);

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard icon={<FaChartLine />} title="Progress Tracker" content="You've completed 60% of your roadmap" />
      <DashboardCard icon={<FaCode />} title="Skill Assessment" content="5 new challenges available" />
      <DashboardCard icon={<FaMoneyBillWave />} title="Mentorship" content="3 new mentor sessions available" />
      <DashboardCard icon={<FaRobot />} title="AI Interview Assistant" content="Practice your next interview" />
      <DashboardCard icon={<FaBookOpen />} title="Curated Courses" content="10 recommended courses for you" />
      <DashboardCard icon={<FaBriefcase />} title="Job Portal" content="15 new job openings match your profile" />
    </div>
  );

  const renderProfileSetup = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile Setup </h2>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${profileSetupStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {step}
            </div>
          ))}
        </div>
        <p className="text-gray-600">Step {profileSetupStep} of 3</p>
      </div>
      {profileSetupStep === 1 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
          <input type="text" placeholder="Full Name" className="w-full p-2 mb-4 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
          <button onClick={() => setProfileSetupStep(2)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Next</button>
        </div>
      )}
      {profileSetupStep === 2 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
          <div className="border-dashed border-2 border-gray-300 p-8 text-center rounded-lg mb-4">
            <AiOutlineUpload className="text-4xl mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Drag and drop your resume here or click to upload</p>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setProfileSetupStep(1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300">Back</button>
            <button onClick={() => setProfileSetupStep(3)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Next</button>
          </div>
        </div>
      )}
      {profileSetupStep === 3 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">GitHub Integration</h3>
          <button className="flex items-center justify-center w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-300 mb-4">
            <SiGithub className="mr-2" /> Connect GitHub Account
          </button>
          <div className="flex justify-between">
            <button onClick={() => setProfileSetupStep(2)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300">Back</button>
            <button onClick={() => setActiveTab('dashboard')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Complete Setup</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSkillAssessment = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Skill Assessment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">LeetCode-style Challenges</h3>
          <p className="text-gray-600 mb-4">Complete coding challenges to assess your skills</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
            <SiLeetcode className="mr-2" /> Start Challenge
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Gap Analysis</h3>
          <p className="text-gray-600 mb-4">Identify areas for improvement in your skill set</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">View Analysis</button>
        </div>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
        <FaCamera className="text-2xl mr-4 text-yellow-600" />
        <div>
          <h3 className="text-lg font-semibold mb-1">Focus Tracking</h3>
          <p className="text-gray-700">{isFocused ? 'You are focused. Keep it up!' : 'You seem distracted. Take a short break if needed.'}</p>
        </div>
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pay-to-Talk Mentorship</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((mentor) => (
          <div key={mentor} className="bg-gray-100 p-4 rounded-lg">
            <img src={`https://randomuser.me/api/portraits/men/${mentor + 60}.jpg`} alt={`Mentor ${mentor}`} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">John Doe {mentor}</h3>
            <p className="text-gray-600 mb-4 text-center">Senior Software Engineer at Tech Giant</p>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Book Session ($50/hr)</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIInterview = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Interview Assistant</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Practice Interview</h3>
        <p className="text-gray-600 mb-4">Simulate a real interview with our AI-powered assistant</p>
        <button onClick={() => navigate('/mock-interview')} // Navigate to MockInterviewPage
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
          <FaRobot className="mr-2" /> Start Interview
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Interview Tips</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Research the company thoroughly</li>
          <li>Prepare examples of your past experiences</li>
          <li>Practice common interview questions</li>
          <li>Dress professionally and arrive early</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfileSetup();
      case 'assessment':
        return renderSkillAssessment();
      case 'mentorship':
        return renderMentorship();
      case 'interview':
        return renderAIInterview();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> Dashboard</h1>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-6">
          <ul>
            {[
              { id: 'dashboard', icon: <FaChartLine />, label: 'Dashboard' },
              { id: 'profile', icon: <FaUser />, label: 'Profile Setup' },
              { id: 'assessment', icon: <FaCode />, label: 'Skill Assessment' },
              { id: 'mentorship', icon: <FaMoneyBillWave />, label: 'Mentorship' },
              { id: 'interview', icon: <FaRobot />, label: 'AI Interview' },
            ].map((item) => (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center p-2 rounded ${activeTab === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 bg-white shadow-md rounded-lg p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, content }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <div className="flex items-center mb-4">
      <div className="text-3xl text-blue-500 mr-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default Dashboard;