// const mongoose = require('mongoose');

// const weatherSummarySchema = new mongoose.Schema({
//   city: String,
//   date: String,
//   temperatures: [Number],
//   conditions: [String],
// });

// weatherSummarySchema.virtual('averageTemp').get(function () {
//   return (this.temperatures.reduce((sum, temp) => sum + temp, 0) / this.temperatures.length).toFixed(2);
// });

// weatherSummarySchema.virtual('maxTemp').get(function () {
//   return Math.max(...this.temperatures);
// });

// weatherSummarySchema.virtual('minTemp').get(function () {
//   return Math.min(...this.temperatures);
// });

// weatherSummarySchema.virtual('dominantCondition').get(function () {
//   return getDominantWeather(this.conditions);
// });

// const WeatherSummary = mongoose.model('WeatherSummary', weatherSummarySchema);
// module.exports = WeatherSummary;
const mongoose = require('mongoose');

const weatherSummarySchema = new mongoose.Schema({
  city: String,
  date: String,
  temperatures: [Number],
  conditions: [String],
});

// Aggregated virtual fields for daily summaries
weatherSummarySchema.virtual('averageTemp').get(function () {
  return (this.temperatures.reduce((sum, temp) => sum + temp, 0) / this.temperatures.length).toFixed(2);
});

weatherSummarySchema.virtual('maxTemp').get(function () {
  return Math.max(...this.temperatures);
});

weatherSummarySchema.virtual('minTemp').get(function () {
  return Math.min(...this.temperatures);
});

weatherSummarySchema.virtual('dominantCondition').get(function () {
  return getDominantWeather(this.conditions);
});

const WeatherSummary = mongoose.model('WeatherSummary', weatherSummarySchema);
module.exports = WeatherSummary;
