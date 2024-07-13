const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const { getCityName } = require('./services/weatherService'); // Assuming weatherService exports getCityName function

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a user schema
const userSchema = new mongoose.Schema({
  email: String,
  location: String,
  weatherData: [{
    date: { type: Date, default: Date.now },
    data: Object
  }]
});

const User = mongoose.model('User', userSchema);

// POST route to create a user
app.post('/users', async (req, res) => {
  const { email, location } = req.body;

  try {
    // Get weather data
    const weatherData = await getWeatherData(location);

    // Create user with initial weather data
    const user = new User({
      email,
      location,
      weatherData: [{ data: weatherData }] // Store initial weather data
    });

    // Save user to MongoDB
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Failed to create user');
  }
});

// PUT route to update user's location
app.put('/users/:email', async (req, res) => {
  const { email } = req.params;
  const { location } = req.body;

  try {
    // Get weather data for new location
    const weatherData = await getWeatherData(location);

    // Update user with new location and append weather data
    const user = await User.findOneAndUpdate(
      { email },
      { location, $push: { weatherData: { data: weatherData } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Failed to update user');
  }
});

// Function to fetch weather data from OpenWeatherMap
const getWeatherData = async (location) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`; // Adjust units as needed
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
