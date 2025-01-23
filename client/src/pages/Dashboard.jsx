import React, { useState, useEffect } from 'react';
import { FaUser, FaChartLine, FaCode, FaMoneyBillWave, FaRobot, FaCamera, FaBookOpen, FaBriefcase, FaUserFriends } from 'react-icons/fa';
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
  
      {/* Dashboard Grid */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        {/* Progress Tracker Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
          <p className="text-gray-600 mb-4">
            Stay on top of your learning journey with insights into your completed tasks and upcoming goals.
          </p>
          <button
            onClick={() => navigate('/OverallDashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <FaChartLine className="mr-2" /> View Progress Tracker
          </button>
        </div>
      </div>
  
      {/* Student Tips Section */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Student Tips for Success</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Set achievable goals and track your progress consistently.</li>
          <li>Engage with resources and mentors to enhance your learning experience.</li>
          <li>Practice regularly and participate in skill challenges to improve.</li>
          <li>Stay organized and maintain a steady learning routine.</li>
        </ul>
      </div>
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
  
      {/* Skill Assessment Grid */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        {/* Technical Problem Solving Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Technical Problem Solving</h3>
          <p className="text-gray-600 mb-4">Complete coding challenges to assess your skills</p>
          <button
            onClick={() => navigate('/SkillAssessment')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <SiLeetcode className="mr-2" /> Start Challenge
          </button>
        </div>
      </div>
  
      {/* Additional Skill Assessment Tips or Sections */}
      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-semibold mb-2">Tips for Successful Skill Assessment</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Practice problem-solving regularly to improve speed and accuracy.</li>
          <li>Break complex problems into smaller, manageable parts.</li>
          <li>Focus on writing clean and efficient code.</li>
          <li>Review solutions after completing challenges to identify areas for improvement.</li>
        </ul>
      </div>
    </div>
  );
  

  const renderMentorship = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mentorship Section</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Connect with Mentors</h3>
        <p className="text-gray-600 mb-4">Gain valuable insights and guidance by connecting with experienced mentors in your field.</p>
        <button onClick={() => navigate('/payment')} // Navigate to MockInterviewPage
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
          <FaUserFriends className="mr-2" /> Explore Mentors
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Mentorship Tips for Students</h3>
        <ul className="list-disc list-inside text-gray-600">
        <li>Identify your goals and expectations before mentoring sessions.</li>
        <li>Be open to constructive feedback and apply it proactively.</li>
        <li>Ask specific questions to make the most of the mentorship experience.</li>
        <li>Maintain regular communication and build a lasting relationship.</li>
        </ul>
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

  const renderJobRecommendation = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Job Portal</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Latest Job Openings</h3>
        <p className="text-gray-600 mb-4">Explore and apply for the latest job opportunities tailored for you.</p>
        <button
          onClick={() => navigate('/JobRecommendation')} // Navigate to Job Listings Page
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaBriefcase className="mr-2" /> Start Applying
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Application Tips</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Customize your resume for each application</li>
          <li>Highlight relevant skills and accomplishments</li>
          <li>Follow application instructions carefully</li>
          <li>Reach out for referrals if possible</li>
        </ul>
      </div>
    </div>
  );
  
  const renderCourseRecommendation = (recommendations) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Course Recommendations</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Recommended Courses for Your Job Role</h3>
        <p className="text-gray-600 mb-4">
          Explore these courses to enhance your skills and boost your career opportunities.
        </p>
        <button
          onClick={() => navigate('/CourseRecommendation')} // Navigate to Job Listings Page
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaBookOpen  className="mr-2" /> Start Learning
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Study Tips</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Set aside dedicated time for study each week.</li>
          <li>Practice with hands-on projects to reinforce learning.</li>
          <li>Join study groups or online communities for support.</li>
          <li>Stay updated on industry trends and technologies.</li>
        </ul>
      </div>
    </div>
  );

  const renderRoadmap = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Career Roadmap</h2>
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <h3 className="text-xl font-semibold mb-2">Recommended Learning Path for Your Job Role</h3>
      <p className="text-gray-600 mb-4">
        Follow this roadmap to enhance your skills and advance your career. 
        Explore the recommended courses and resources tailored for your job role.
      </p>
      <button
        onClick={() => navigate('/Roadmap')} // Navigate to Roadmap Page
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <FaChartLine  className="mr-2" /> Start Your Journey
      </button>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Study Tips for Success</h3>
      <ul className="list-disc list-inside text-gray-600">
        <li>Set specific goals and milestones for your learning journey.</li>
        <li>Engage in hands-on projects to apply your knowledge practically.</li>
        <li>Participate in study groups or forums for collaborative learning.</li>
        <li>Keep abreast of industry trends and continuously update your skills.</li>
      </ul>
    </div>
  </div>
);

  
  

  const renderContent = () => {
    switch (activeTab) {
      case 'overalldashboard':
        return renderDashboard();
     
      case 'assessment':
        return renderSkillAssessment();
      case 'payment':
        return renderMentorship();
      case 'interview':
        return renderAIInterview();
      case 'jobrecommendation':
        return renderJobRecommendation();
      case 'courserecommendation':
        return renderCourseRecommendation();
      case 'roadmap':
          return renderRoadmap();
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
              { id: 'overalldashboard', icon: <FaChartLine />, label: 'Dashboard' },
             
              { id: 'assessment', icon: <FaCode />, label: 'Skill Assessment' },
              { id: 'payment', icon: <FaMoneyBillWave />, label: 'Mentorship' },
              { id: 'interview', icon: <FaRobot />, label: 'AI Interview' },
              { id: 'jobrecommendation', icon: <FaBriefcase />, label: 'Apply to Jobs' },
              { id: 'courserecommendation', icon: <FaBookOpen />, label: 'Courses' },
              { id: 'roadmap', icon: <FaChartLine />, label: 'Roadmap' },

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



export default Dashboard;