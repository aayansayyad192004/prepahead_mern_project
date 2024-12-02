import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // To navigate after payment

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamically create the Razorpay payment button script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_PRwwNDaM0aFY8r"); // Ensure this ID is correct
    script.async = true;

    // Append the script to the form element
    const form = document.getElementById("razorpay-form");
    form.appendChild(script);

    // Handle payment success and error
    script.onload = () => {
      if (window.RazorpayCheckout) {
        window.RazorpayCheckout.on('payment.success', function (payment) {
          // Payment success callback
          alert("Payment Successful!");
          setTimeout(() => {
            navigate('/mentorship'); // Navigate to mentorship page after success
          }, 100); // Small delay before navigation
        });

        window.RazorpayCheckout.on('payment.error', function (error) {
          // Payment error callback
          alert("Payment Failed! Please try again.");
        });
      } else {
        console.error('RazorpayCheckout is not loaded');
      }
    };

    // Clean up the script when component is unmounted
    return () => {
      form.removeChild(script);
    };
  }, [navigate]); // Adding navigate to the dependency array

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-8">
      {/* Header Section */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Mentorship Payment</h1>
        <p className="text-gray-600 mt-2">
          Pay for your one-on-one mentorship session and take the next step in your career!
        </p>
      </header>

      {/* Subscription Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Secure Payment</h2>
        <p className="text-gray-700 mb-6">
          Click the button below to proceed with your mentorship payment.
        </p>

        {/* Razorpay Payment Form */}
        <form id="razorpay-form"></form>

        <p className="text-sm text-gray-500 mt-4">
          Secure payment powered by Razorpay.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
