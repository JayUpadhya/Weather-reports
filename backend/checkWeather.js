require('dotenv').config();
const axios = require('axios');

// Function to fetch weather data
const getWeatherData = async (location) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    return null;
  }
};

// Test the function
getWeatherData('London')
  .then(data => {
    if (data) {
      console.log('Weather data:', data);
    } else {
      console.log('Failed to fetch weather data.');
    }
  })
  .catch(error => console.error('Error:', error));
