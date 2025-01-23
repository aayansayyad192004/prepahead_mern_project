import { FaSearch, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  return (
    <header className="bg-orange-400 dark:bg-gray-900 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-200 dark:text-white">Prep</span>
            <span className="text-red-950 dark:text-yellow-400">Ahead</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 dark:bg-gray-700 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600 dark:text-gray-300" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-red-950 dark:text-yellow-400 hover:underline">
              Home
            </li>
          </Link>
          {currentUser?.role === 'mentor' && (
             <Link to={`/mentor-chat/${currentUser.studentUsername}`}>
              <li className="text-red-950 dark:text-yellow-400 hover:underline">
                <FaEnvelope />
              </li>
            </Link>
          )}
          {currentUser?.role === 'student' && (
            <Link to="/dashboard">
              <li className="hidden sm:inline text-red-950 dark:text-yellow-400 hover:underline">
                Dashboard
              </li>
            </Link>
          )}
          <Link to="/about">
            <li className="hidden sm:inline text-red-950 dark:text-yellow-400 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <li className="text-red-950 dark:text-yellow-400 hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}