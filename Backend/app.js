
// const { saveDailySummaryToDatabase } = require('./services/weatherSummaryService');
// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');
// const cron = require('node-cron');
// const WeatherSummary = require('./models/weatherSummary');
// require('dotenv').config(); // Load environment variables
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware to parse JSON requests
// app.use(express.json()); // Add this line to enable JSON parsing for incoming requests
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
//   credentials: true, // If you need to include credentials (like cookies)
// }));

// // Connect to MongoDB
// const mongoURI = process.env.MONGODB_URL; // Example for local MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => {
//         console.error('MongoDB connection error:', err);
//         process.exit(1); // Exit the application if MongoDB fails to connect
//     });

// // List of cities to fetch weather data for
// const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']; 

// // Convert Kelvin to Celsius
// const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

// // Alert threshold for temperature
// const temperatureThreshold = 35;

// // Fetch weather data for each city every 5 minutes
// cron.schedule('*/5 * * * *', async () => {
//     console.log('Fetching weather data...');
//     for (let city of cities) {
//         try {
//             const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
            
//             if (data.main && data.weather) {
//                 const averageTemp = kelvinToCelsius(data.main.temp);
//                 const dominantCondition = data.weather[0].main;

//                 // Check if temperature exceeds the threshold
//                 if (parseFloat(averageTemp) > temperatureThreshold) {
//                     console.warn(`Alert: ${city} has exceeded the threshold with a temperature of ${averageTemp}°C!`);
//                 }

//                 const weatherData = {
//                     city,
//                     averageTemp,
//                     dominantCondition,
//                 };

//                 // Save daily summary to the database
//                 await saveDailySummaryToDatabase(weatherData, city);
//             } else {
//                 console.error(`Unexpected response structure for city ${city}:`, data);
//             }
//         } catch (error) {
//             console.error(`Error fetching weather data for ${city}:`, error.message);
//         }
//     }
// });

// // API endpoint to retrieve weather summaries
// app.post('/api/weather-summary', async (req, res) => {
//     try {
//         const summaries = await WeatherSummary.find({});
//         res.json(summaries);
//     } catch (error) {
//         res.status(500).send('Error retrieving weather summaries');
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const { saveDailySummaryToDatabase } = require('./services/weatherSummaryService');
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
const cors = require('cors');
const WeatherSummary = require('./models/WeatherSummary');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'], // Allow only necessary methods
  credentials: true,
}));

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URL; // Example for local MongoDB

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add your cities array and kelvinToCelsius function here

// Endpoint to save daily summary
app.post('/api/save-daily-summary', async (req, res) => {
    const { averageTemp, dominantCondition } = req.body;

    if (!averageTemp || !dominantCondition) {
        return res.status(400).send({ error: 'Invalid data received.' });
    }

    try {
        // Create a new WeatherSummary document
        const summary = new WeatherSummary({
            averageTemp,
            dominantCondition,
            createdAt: new Date(), // Add a timestamp if needed
        });

        // Save to the database
        await summary.save();
        
        res.status(201).send({ message: 'Daily summary saved successfully.' });
    } catch (error) {
        console.error('Error saving daily summary:', error);
        res.status(500).send({ error: 'Error saving daily summary.' });
    }
});

// Other API endpoints

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
