import React, { useState } from "react";

const MentorshipPage = () => {
  const [selectedField, setSelectedField] = useState("Frontend Developer");

  // Mock data for mentors
  const mentors = [
    {
      id: 1,
      name: "Sai Teja Reddy",
      expertise: "Frontend Developer",
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      price: 2249,
      description:
        "Expert in React.js and Tailwind CSS with 5+ years of mentoring experience.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      expertise: "Backend Developer",
      rating: 4.7,
      image: "https://randomuser.me/api/portraits/women/76.jpg",
      price: 2499,
      description:
        "Specialized in Node.js and Express.js with hands-on project guidance.",
    },
  ];

  // Filter mentors by expertise
  const filteredMentors = mentors.filter(
    (mentor) => mentor.expertise === selectedField
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Find Your Mentor for {selectedField}
      </h1>

      {/* Field Selector */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-4 py-2 rounded-lg mr-4 ${
            selectedField === "Frontend Developer"
              ? "bg-blue-600"
              : "bg-gray-700"
          }`}
          onClick={() => setSelectedField("Frontend Developer")}
        >
          Frontend Developer
        </button>
        <button
          className={`px-4 py-2 rounded-lg mr-4 ${
            selectedField === "Backend Developer" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setSelectedField("Backend Developer")}
        >
          Backend Developer
        </button>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl"
          >
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center mb-2">
              {mentor.name}
            </h2>
            <p className="text-sm text-gray-400 text-center mb-4">
              {mentor.expertise}
            </p>
            <p className="text-center mb-4">{mentor.description}</p>
            <p className="text-center text-yellow-500 font-bold mb-4">
              Rating: {mentor.rating}⭐
            </p>
            <p className="text-center font-semibold text-lg mb-6">
              ₹{mentor.price} / month
            </p>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700"
              onClick={() => {
                alert("Redirecting to payment gateway...");
                // Replace this with payment integration logic
              }}
            >
              Book Session Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorshipPage;
