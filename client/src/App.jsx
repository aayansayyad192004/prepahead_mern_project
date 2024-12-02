import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

import MockInterviewPage from './pages/MockInterviewPage'; 
import SkillAssessment from './pages/SkillAssessment';
import JobRecommendation from './pages/JobRecommendation';
import CourseRecommendation from './pages/CourseRecommendation';
import Roadmap from './pages/Roadmap';
import MentorshipPage from './pages/MentorshipPage';
import PaymentPage from "./pages/PaymentPage"; // Correct import for PaymentPage
import OverallDashboard from './pages/OverallDashboard';

export default function App() {
  return (
    <BrowserRouter>
      {/* Header Component */}
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
        <Route path="/OverallDashboard" element={<OverallDashboard />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/skillassessment" element={<SkillAssessment />} />
          <Route path="/jobrecommendation" element={<JobRecommendation />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/courserecommendation" element={<CourseRecommendation />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/MentorshipPage" element={<MentorshipPage />} />
        </Route>

        {/* Subscription and Mentorship Routes */}
        
      </Routes>
    </BrowserRouter>
  );
}
