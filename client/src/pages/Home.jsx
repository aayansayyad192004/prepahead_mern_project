import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5,  // Default rating set to 5
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleRatingChange = (rating) => {
    setForm({
      ...form,
      rating,  // Update rating when a star is clicked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    // Convert the rating to star symbols
    const starRating = '★'.repeat(form.rating) + '☆'.repeat(5 - form.rating);
    console.log(starRating); // Log the star rating to ensure it's correct

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          rating: starRating, // Send the star symbols as rating
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSending(false);
          alert("Thank you for your feedback! We'll get back to you soon.");
          setForm({
            name: '',
            email: '',
            message: '',
            rating: 5,  // Reset rating after submission
          });
        },
        (error) => {
          setSending(false);
          console.error(error);
          alert("Oops! Something went wrong. Please try again.");
        }
      );
  };

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
              <section className="mb-12">
                <div className='bg-blue-100 rounded-md'>
                  {/* top */}
                  <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                    <h1 className='text-blue-900 font-bold text-3xl lg:text-6xl'>
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
              
  <section className="mb-12 text-center">
  <h3 className="text-4xl font-bold mb-6 text-white-300 flex items-center justify-center gap-2">
    🚀 <span className="text-gray-100">Why Choose Us?</span>
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg">
      <h4 className="text-2xl font-semibold flex items-center justify-center gap-2">
        🤖 AI-Driven Insights
      </h4>
      <p className="mt-2 text-lg text-gray-200">
        Get personalized career guidance powered by artificial intelligence.
      </p>
    </div>
    <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg">
      <h4 className="text-2xl font-semibold flex items-center justify-center gap-2">
      💻 Mock Interviews
      </h4>
      <p className="mt-2 text-lg text-gray-200">
        Practice with AI-driven mock interviews to ace real ones.
      </p>
    </div>
    <div className="p-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-lg">
      <h4 className="text-2xl font-semibold flex items-center justify-center gap-2">
        👨‍🏫 Expert Mentorship
      </h4>
      <p className="mt-2 text-lg text-gray-200">
        Connect with industry professionals for career advice.
      </p>
    </div>
  </div>
</section>


              <section className="mb-12">
                <h3 className="text-4xl font-bold mb-4 text-center">Feedback</h3>
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-black"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-black"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md text-black"
                      required
                    ></textarea>
                  </div>

                  {/* Star Rating Section */}
                  <div className="mb-4">
                    <label htmlFor="rating" className="block mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`cursor-pointer text-2xl ${form.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                          onClick={() => handleRatingChange(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : 'Send Feedback'}
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
