// const WeatherSummary = require('../models/WeatherSummary.js');

// async function saveDailySummaryToDatabase(dailySummary, city) {
//     const today = new Date();
//     const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

//     // Check if the summary for today already exists
//     let summary = await WeatherSummary.findOne({ city, date: dateString });

//     // If it doesn't exist, create a new summary
//     if (!summary) {
//         summary = new WeatherSummary({
//             city: city,
//             date: dateString,
//             temperatures: [],
//             conditions: [],
//         });
//     }

//     // Push the temperature and condition for the current weather data
//     summary.temperatures.push(parseFloat(dailySummary.averageTemp));
//     summary.conditions.push(dailySummary.dominantCondition);

//     try {
//         await summary.save();
//         console.log(`Daily summary saved for ${city} on ${dateString}`);
//     } catch (error) {
//         console.error('Error saving daily summary:', error);
//     }
// }

// module.exports = { saveDailySummaryToDatabase };


const WeatherSummary = require('../models/WeatherSummary.js');

async function saveDailySummaryToDatabase(dailySummary, city) {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // Check if the summary for today already exists
  let summary = await WeatherSummary.findOne({ city, date: dateString });

  // If it doesn't exist, create a new summary
  if (!summary) {
    summary = new WeatherSummary({
      city: city,
      date: dateString,
      temperatures: [],
      conditions: [],
    });
  }

  // Push the temperature and condition for the current weather data
  summary.temperatures.push(parseFloat(dailySummary.averageTemp));
  summary.conditions.push(dailySummary.dominantCondition);

  try {
    await summary.save();
    console.log(`Daily summary saved for ${city} on ${dateString}`);
  } catch (error) {
    console.error('Error saving daily summary:', error);
  }
}

module.exports = { saveDailySummaryToDatabase };
