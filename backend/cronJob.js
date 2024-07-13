// cronJob.js
const cron = require('node-cron');
const User = require('./models/User');
const { getWeatherData } = require('./services/weatherService');
const { sendWeatherReport } = require('./services/emailService');

cron.schedule('0 0 */3 * * *', async () => {
  const users = await User.find();
  for (const user of users) {
    const weatherData = await getWeatherData(user.location);
    user.weatherData.push({ date: new Date(), weather: weatherData });
    await user.save();
    await sendWeatherReport(user.email, weatherData);
  }
});
