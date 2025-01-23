import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    window.location.href = '/Dashboard';  // Redirect to the Dashboard page
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <AnimatePresence>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <section className="mb-12 ">
                
                <div className='bg-blue-100 rounded-md'>
         {/* top */}
         <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
         <h1 className='text-blue-900 font-bold text-3xl lg:text-6xl '>
           Find Your <span className='text-green-500'>Dream Job</span>
          <br />
          with Expert Guidance
          </h1>
          <div className='text-blue-900 text-xs sm:text-sm'>
          PrepAhead helps you accelerate your career with personalized roadmaps, skill assessments, and mentorship.
          <br />
          Get instant profile setup, AI-driven interview prep, and more.
          </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-2 w-1/4 rounded-full hover:bg-blue-600 transition-colors duration-200"
                  onClick={handleGetStarted} 
                  >
                  Get Started
                </motion.button>
     </div>
  </div>
                
              </section>

              <section className="mb-12">
                <h3 className="text-4xl font-bold mb-4 text-center">Featured Roadmaps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Web Development', 'Data Science', 'UX Design'].map((roadmap, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
                      whileHover={{ y: -5 }}
                    >
                      <h4 className="text-xl font-semibold mb-2">{roadmap}</h4>
                      <p className="mb-4">Master the skills needed to excel in {roadmap.toLowerCase()}.</p>
                      <a href="#" className="text-blue-500 hover:underline">View Roadmap</a>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
              <h3 className="text-4xl font-bold mb-4 text-center">Feedback</h3>
                <form className="max-w-lg mx-auto">
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input type="text" id="name" className="w-full px-3 py-2 border rounded-md" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-3 py-2 border rounded-md" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block mb-2">Message</label>
                    <textarea id="message" rows="4" className="w-full px-3 py-2 border rounded-md" required></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                  >
                    Send Feedback
                  </motion.button>
                </form>
              </section>
            </>
          )}
        </main>
      </AnimatePresence>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 PrepAhead. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" aria-label="Facebook" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"><FaFacebook /></a>
              <a href="#" aria-label="Twitter" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"><FaLinkedin /></a>
              <a href="#" aria-label="Instagram" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"><FaInstagram /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;