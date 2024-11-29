import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]); // State to store subscription plans
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch subscription plans from the API
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/subscription/plans'); // Make sure this matches the actual backend API
        console.log('Fetched subscription plans:', response.data); // Log response data
        setPlans(response.data); // Set the fetched plans in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        setError('Failed to fetch subscription plans');
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchPlans();
  }, []); // Empty dependency array ensures this effect runs only once

  // Handle subscription click (can be extended to trigger payment)
  const handleSubscribe = (planId) => {
    // Logic for handling subscription (you can integrate payment gateway here)
    console.log('Subscribing to plan with ID:', planId);
    // Example of making a subscription request or redirecting to payment
    // axios.post('/api/subscribe', { planId }).then(response => {
    //   console.log('Subscription successful:', response.data);
    // }).catch(error => {
    //   console.error('Subscription failed:', error);
    // });
  };

  return (
    <div className="container mx-auto my-8">
      {loading ? (
        <div className="text-center">Loading subscription plans...</div> // Display loading message
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Display error message if an error occurred
      ) : plans.length === 0 ? (
        <div className="text-center text-gray-500">No subscription plans available.</div> // Display message if no plans are available
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{plan.name}</div>
                <p className="text-gray-700 text-base">{plan.description}</p>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">₹{plan.price}</span>
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => handleSubscribe(plan._id)} // Trigger subscription on click
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
