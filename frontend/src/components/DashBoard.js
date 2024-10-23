// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import Weather from './Weather.js';

// Chart.register(...registerables);

// const DashBoard = () => {
//   const [weatherData, setWeatherData] = useState([]);
  
//   useEffect(() => {
//     const fetchWeatherData = async () => {
//         const response = await axios.get('http://localhost:5000/api/weather-summary');
//         setWeatherData(response.data);
//     };
//     fetchWeatherData();
//   }, []);

//   const prepareChartData = () => {
//     const labels = weatherData.map(item => item.city + ' ' + item.date);
//     const avgTemps = weatherData.map(item => item.averageTemp);
    
//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Average Temperature (°C)',
//           data: avgTemps,
//           borderColor: 'rgba(75,192,192,1)',
//           borderWidth: 1,
//         }
//       ]
//     };
//   };

//   return (
//     <div>
//       <h2>Weather Monitoring Dashboard</h2>
//       <Line key={JSON.stringify(weatherData)} data={prepareChartData()} />
//       <Weather/>
//     </div>
//   );
// };

// export default DashBoard;
