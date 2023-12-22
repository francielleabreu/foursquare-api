import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('It is no possible to find user location:', error);
        }
      );
    } else {
      console.error('Location is not supported.');
    }
  }, []);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchVenues();
    }
  }, [latitude, longitude]);

  const fetchVenues = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: API_KEY
        }
      };

      const response = await fetch(
        `${API_URL}?v=20211221&ll=${latitude},${longitude}&query=${query}`, options
      );
      const data = await response.json();
      setVenues(data.results);
    } catch (error) {
      console.error('Error fetching data from Foursquare API:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVenues();
  };

  return (
    <div>
      <h1>Foursquare Venues Explorer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Search for locations:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h2>Venues around your location:</h2>
      <ul>
        {venues.map((venue) => (
          <li key={venue.fsq_id}>{venue.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;