// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Weather = () => {
//   const [weatherData, setWeatherData] = useState([]);

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/weather');
//         setWeatherData(response.data);
//       } catch (error) {
//         console.error('Error fetching weather data:', error);
//       }
//     };

//     fetchWeatherData();
//   }, []);

//   const cities = weatherData.map(city => city.city);
//   const temperatures = weatherData.map(city => parseFloat(city.temperature));

//   const chartData = {
//     labels: cities,
//     datasets: [
//       {
//         label: 'Temperature (°C)',
//         data: temperatures,
//         fill: false,
//         borderColor: 'rgba(75,192,192,1)',
//         tension: 0.1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Real-Time Weather Temperatures',
//       },
//     },
//   };

//   return (
//     <div>
//       <h1>Real-Time Weather Monitoring</h1>
//       <Line data={chartData} options={chartOptions} />
//       <ul>
//         {weatherData.map((city, index) => (
//           <li key={index}>
//             {city.city}: {city.temperature}°C, {city.condition}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Weather;
