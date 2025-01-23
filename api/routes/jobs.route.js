import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route to fetch job listings
router.get('/', async (req, res) => {
  const { search, location, country } = req.query;

  console.log("Received search parameters:", { search, location, country });

  if (!search || !location || !country) {
    return res.status(400).json({ message: 'Search term, location, and country are required.' });
  }

  const options = {
    method: 'POST',
    url: 'https://google-jobs-scraper-api.p.rapidapi.com/api/job',
    headers: {
      'x-rapidapi-key': '465640195fmsh636c73b0fea6812p12b091jsn329b971fb36b',  // Your RapidAPI Key
      'x-rapidapi-host': 'google-jobs-scraper-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      scraper: {
        filters: {
          country: country,  // e.g., 'US' or 'IN'
          domain: 'com',
          query: search,  // e.g., 'Frontend Developer'
          location: location  // e.g., 'Silicon Valley'
        },
        maxRows: 20
      }
    })
  };

  try {
    // Fetch data from external API using axios
    const response = await axios(options);

    if (response.data && response.data.jobs) {
      console.log("Jobs fetched successfully:", response.data.jobs); // Log the response
      res.json(response.data.jobs);
    } else {
      console.log("No jobs found for the search criteria.");
      res.status(404).json({ message: 'No jobs found for the search criteria' });
    }
  } catch (err) {
    console.error("Error fetching jobs:", err.message || err);
    res.status(500).json({ message: 'Failed to fetch job listings. Please try again later.' });
  }
});

export default router;
