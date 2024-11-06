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
export default function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="/SkillAssessment" element={<SkillAssessment />} />
        <Route path="/JobRecommendation" element={<JobRecommendation />} />
        <Route path="/CourseRecommendation" element={<CourseRecommendation />} />
        <Route path="/roadmap" element={<Roadmap />} />

      </Routes>
    </BrowserRouter>
  );
}
