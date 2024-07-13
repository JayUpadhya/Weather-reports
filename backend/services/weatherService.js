// services/weatherService.js
const axios = require('axios');

const getWeatherData = async (location) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const getCityName = async (lat, lon) => {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`);
    return response.data.results[0].address_components.filter(component => component.types.includes('locality'))[0].long_name;
  } catch (error) {
    console.error('Error fetching city name:', error);
    return null;
  }
};

module.exports = { getWeatherData, getCityName };
