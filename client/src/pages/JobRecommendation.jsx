import React, { useState } from 'react';
import axios from 'axios';

const JobRecommendation = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [jobs, setJobs] = useState([]);         // exact-location jobs
  const [otherJobs, setOtherJobs] = useState([]); // fallback jobs
  const [exactMatchFound, setExactMatchFound] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setJobs([]);
    setOtherJobs([]);

    try {
      const response = await axios.get('/api/jobs', {
        params: { search, location, country },
      });

      const data = Array.isArray(response.data) ? response.data : [];

      // split results into exact-location matches and everything else
      const loc = location.trim().toLowerCase();
      const matched = data.filter((job) =>
        job.location?.toLowerCase().includes(loc)
      );
      const others = data.filter(
        (job) => !job.location?.toLowerCase().includes(loc)
      );

      setExactMatchFound(matched.length > 0);
      setJobs(matched);
      setOtherJobs(others);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const renderJobCard = (job, index) => (
    <div
      key={index}
      className="p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h3>
      <p className="text-gray-700 text-lg">
        Company: <span className="font-medium text-gray-800">{job.company}</span>
      </p>
      <p className="text-gray-700 text-lg">
        Location:{' '}
        <span className="font-medium text-gray-800">{job.location}</span>
      </p>
      <a
        href={`https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(
          job.company
        )}&${encodeURIComponent(job.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 mt-4 inline-block"
      >
        Apply
      </a>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl max-h-4xl mt-9 mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-5xl font-bold mb-8 text-center text-blue-700">
        Job Recommendations
      </h2>

      {/* ────── Search Form ────── */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Job Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
        >
          Search
        </button>
      </form>

      {/* ────── Status Messages ────── */}
      {loading && (
        <p className="text-center text-gray-500">Loading jobs...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ────── Exact-location Jobs ────── */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-8 mb-10">
          <h3 className="text-xl font-bold text-blue-600 text-center mb-4">
            Jobs in&nbsp;{location}
          </h3>
          {jobs.map(renderJobCard)}
        </div>
      )}

      {/* ────── Popup if none in location ────── */}
      {!loading && !exactMatchFound && (
        <p className="text-center text-orange-600 font-medium mb-6">
          No jobs found in&nbsp;<strong>{location}</strong>. 
        </p>
      )}

      {/* ────── Fallback Jobs ────── */}
      {!loading && otherJobs.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
            Jobs in other locations
          </h3>
          {otherJobs.map(renderJobCard)}
        </div>
      )}

      {/* ────── Nothing at all ────── */}
      {!loading && jobs.length === 0 && otherJobs.length === 0 && (
        <p className="text-center text-gray-500">
          No jobs found. Try adjusting your search criteria.
        </p>
      )}
    </div>
  );
};

export default JobRecommendation;
