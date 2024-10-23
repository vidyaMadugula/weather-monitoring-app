

// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

// const WeatherChart = () => {
//     const [weatherData, setWeatherData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const [dailySummary, setDailySummary] = useState({
//         averageTemp: null,
//         maxTemp: null,
//         minTemp: null,
//         dominantCondition: null,
//     });
//     const [alertThreshold, setAlertThreshold] = useState();
//     const [alerts, setAlerts] = useState([]);
//     const [fetchInterval, setFetchInterval] = useState(300000); // Fetch interval state (default 5 minutes)
//     const timeoutRef = useRef(null);
//     const temperatureHistory = useRef({});
//     const [error, setError] = useState(null); // State for error handling

//     const API_KEY = 'acf0c67c8c2693c4da4b975cd278a20f'; // Replace with your OpenWeatherMap API key

//     const checkForAlerts = useCallback((newData) => {
//         const parsedThreshold = parseFloat(alertThreshold);
//         if (isNaN(parsedThreshold)) return;

//         const newAlerts = newData.map(({ temp, city }) => {
//             if (parseFloat(temp) > parsedThreshold) {
//                 return `Alert: ${city} has exceeded the threshold of ${parsedThreshold}°C with a temperature of ${temp}°C!`;
//             }
//             return null;
//         }).filter(alert => alert !== null);

//         setAlerts(newAlerts);
//     }, [alertThreshold]);

//     const calculateDailySummary = async (newData) => {
//         const temperatures = newData.map(data => parseFloat(data.temp));
//         const conditions = newData.map(data => data.condition);
//         const averageTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2);
//         const maxTemp = Math.max(...temperatures).toFixed(2);
//         const minTemp = Math.min(...temperatures).toFixed(2);
//         const dominantCondition = conditions.reduce((a, b) =>
//             conditions.filter(v => v === a).length >= conditions.filter(v => v === b).length ? a : b
//         );

//         setDailySummary({
//             averageTemp,
//             maxTemp,
//             minTemp,
//             dominantCondition,
//         });

//         // Save daily summary to the backend
//         try {
//             await axios.post('http://localhost:5000/api/save-daily-summary', { averageTemp, dominantCondition });
//             console.log('Daily summary saved successfully');
//         } catch (error) {
//             console.error('Error saving daily summary:', error);
//         }
//     };

//     useEffect(() => {
//         const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

//         const fetchWeatherData = async () => {
//             try {
//                 const responses = await Promise.all(
//                     cities.map(city =>
//                         axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
//                     )
//                 );

//                 const newData = responses.map((response, index) => {
//                     const { main, weather, dt } = response.data;
//                     const tempCelsius = main.temp - 273.15; // Convert from Kelvin to Celsius
//                     return {
//                         city: cities[index],
//                         temp: tempCelsius.toFixed(2),
//                         condition: weather[0].main,
//                         timestamp: new Date(dt * 1000).toLocaleTimeString(),
//                     };
//                 });

//                 setWeatherData(newData);
//                 setLabels(newData.map(data => data.timestamp));
//                 updateTemperatureHistory(newData);
//                 await calculateDailySummary(newData);
//                 checkForAlerts(newData);

//                 // Reset error state on successful fetch
//                 setError(null);
//             } catch (error) {
//                 handleFetchError(error); // Custom error handling
//             }
//         };

//         const updateTemperatureHistory = (newData) => {
//             newData.forEach(({ city, temp }) => {
//                 if (!temperatureHistory.current[city]) {
//                     temperatureHistory.current[city] = [];
//                 }
//                 temperatureHistory.current[city].push(temp);
//             });
//         };

//         fetchWeatherData();
//         const intervalId = setInterval(fetchWeatherData, fetchInterval); // Use fetchInterval here

//         return () => {
//             clearInterval(intervalId);
//             if (timeoutRef.current) {
//                 clearTimeout(timeoutRef.current);
//             }
//         };
//     }, [API_KEY, checkForAlerts, fetchInterval]); // Include fetchInterval here

//     const handleFetchError = (error) => {
//         // Custom error handling based on error type
//         if (error.response) {
//             if (error.response.status === 401) {
//                 setError("Invalid API key. Please check your API key.");
//             } else if (error.response.status === 404) {
//                 setError("City not found. Please check the city names.");
//             } else {
//                 setError("An error occurred while fetching the weather data.");
//             }
//         } else if (error.request) {
//             setError("Network error. Please check your internet connection.");
//         } else {
//             setError("An unexpected error occurred.");
//         }
//     };

//     const handleThresholdChange = (e) => {
//         const value = e.target.value;
//         setAlertThreshold(value);

//         if (timeoutRef.current) {
//             clearTimeout(timeoutRef.current);
//         }

//         // If the input is empty, reset alerts
//         if (value.trim() === '') {
//             setAlerts([]); // Clear alerts if input is empty
//             return; // Exit the function early
//         }

//         // Set timeout to check for alerts after 2 seconds only if value is a valid number
//         timeoutRef.current = setTimeout(() => {
//             const newWeatherData = weatherData;
//             checkForAlerts(newWeatherData);
//         }, 2000); // Check for alerts after 2 seconds
//     };

//     const handleFetchIntervalChange = (e) => {
//         const value = parseInt(e.target.value, 10);
//         if (!isNaN(value) && value > 0) {
//             setFetchInterval(value * 1000);
//         }
//     };

//     const datasets = Object.keys(temperatureHistory.current).map(city => ({
//         label: city,
//         data: temperatureHistory.current[city],
//         fill: false,
//         borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
//         tension: 0.1,
//     }));

//     const data = {
//         labels: labels,
//         datasets: datasets,
//     };

//     return (
//         <div>
//             <h2>Real-Time Weather Data</h2>
//             {error && (
//                 <div style={{
//                     color: 'red', 
//                     backgroundColor: '#ffcccb', 
//                     padding: '10px', 
//                     marginBottom: '10px', 
//                     borderRadius: '5px'
//                 }}>
//                     {error}
//                 </div>
//             )} {/* Error message with custom style */}
//             <Line data={data} />
//             <div>
//                 <h3>Daily Summary</h3>
//                 <p>Average Temperature: {dailySummary.averageTemp}°C</p>
//                 <p>Max Temperature: {dailySummary.maxTemp}°C</p>
//                 <p>Min Temperature: {dailySummary.minTemp}°C</p>
//                 <p>Dominant Condition: {dailySummary.dominantCondition}</p>
//             </div>
//             <div>
//                 <h3>Set Alert Threshold</h3>
//                 <input 
//                     type="number" 
//                     value={alertThreshold} 
//                     onChange={handleThresholdChange} 
//                     placeholder="Set temperature threshold" 
//                 />
//             </div>
//             <div>
//                 <h3>Set Fetch Interval (seconds)</h3>
//                 <input 
//                     type="number" 
//                     onChange={handleFetchIntervalChange} 
//                     placeholder="Fetch interval in seconds" 
//                 />
//             </div>
//             <div>
//                 <h3>Alerts</h3>
//                 {alerts.length > 0 ? (
//                     alerts.map((alert, index) => (
//                         <p key={index}>{alert}</p>
//                     ))
//                 ) : (
//                     <p>No alerts</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WeatherChart;



import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const WeatherChart = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [dailySummary, setDailySummary] = useState({
        averageTemp: null,
        maxTemp: null,
        minTemp: null,
        dominantCondition: null,
    });
    const [alertThreshold, setAlertThreshold] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [fetchInterval, setFetchInterval] = useState(300); // Default to 300 seconds (5 minutes)
    const timeoutRef = useRef(null);
    const temperatureHistory = useRef({});
    const [error, setError] = useState(null); // State for error handling

    const API_KEY = 'acf0c67c8c2693c4da4b975cd278a20f'; // Replace with your OpenWeatherMap API key

    const fetchWeatherDataForCity = async (city) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const { main, weather, dt } = response.data;
            const tempCelsius = main.temp - 273.15; // Convert from Kelvin to Celsius
            return {
                city,
                temp: tempCelsius.toFixed(2),
                condition: weather[0].main,
                timestamp: new Date(dt * 1000).toLocaleTimeString(),
            };
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error("Rate limit exceeded. Waiting before retrying.");
                // Wait for 10 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 10000));
                return fetchWeatherDataForCity(city); // Retry the request
            }
            throw error; // Rethrow if not a 429 error
        }
    };

    const fetchWeatherData = async () => {
        const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
        const newData = [];

        for (const city of cities) {
            const cityData = await fetchWeatherDataForCity(city);
            newData.push(cityData);
        }

        setWeatherData(newData);
        setLabels(newData.map(data => data.timestamp));
        updateTemperatureHistory(newData);
        await calculateDailySummary(newData);
        checkForAlerts(newData);

        // Reset error state on successful fetch
        setError(null);
    };

    const updateTemperatureHistory = (newData) => {
        newData.forEach(({ city, temp }) => {
            if (!temperatureHistory.current[city]) {
                temperatureHistory.current[city] = [];
            }
            temperatureHistory.current[city].push(temp);
        });
    };

    const calculateDailySummary = async (newData) => {
        const temperatures = newData.map(data => parseFloat(data.temp));
        const conditions = newData.map(data => data.condition);
        const averageTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(2);
        const maxTemp = Math.max(...temperatures).toFixed(2);
        const minTemp = Math.min(...temperatures).toFixed(2);
        const dominantCondition = conditions.reduce((a, b) =>
            conditions.filter(v => v === a).length >= conditions.filter(v => v === b).length ? a : b
        );

        setDailySummary({
            averageTemp,
            maxTemp,
            minTemp,
            dominantCondition,
        });

        // Save daily summary to the backend
        try {
            await axios.post('http://localhost:5000/api/save-daily-summary', { averageTemp, dominantCondition });
            console.log('Daily summary saved successfully');
        } catch (error) {
            console.error('Error saving daily summary:', error);
        }
    };

    const checkForAlerts = useCallback((newData) => {
        const parsedThreshold = parseFloat(alertThreshold);
        if (isNaN(parsedThreshold)) return;

        const newAlerts = newData.map(({ temp, city }) => {
            if (parseFloat(temp) > parsedThreshold) {
                return `Alert: ${city} has exceeded the threshold of ${parsedThreshold}°C with a temperature of ${temp}°C!`;
            }
            return null;
        }).filter(alert => alert !== null);

        setAlerts(newAlerts);
    }, [alertThreshold]);

    useEffect(() => {
        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, fetchInterval * 1000); // Use fetchInterval here

        return () => {
            clearInterval(intervalId);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [API_KEY, checkForAlerts, fetchInterval]); // Include fetchInterval here

    const handleFetchError = (error) => {
        // Custom error handling based on error type
        if (error.response) {
            if (error.response.status === 401) {
                setError("Invalid API key. Please check your API key.");
            } else if (error.response.status === 404) {
                setError("City not found. Please check the city names.");
            } else {
                setError("An error occurred while fetching the weather data.");
            }
        } else if (error.request) {
            setError("Network error. Please check your internet connection.");
        } else {
            setError("An unexpected error occurred.");
        }
    };

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        setAlertThreshold(value);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // If the input is empty, reset alerts
        if (value.trim() === '') {
            setAlerts([]); // Clear alerts if input is empty
            return; // Exit the function early
        }

        // Set timeout to check for alerts after 2 seconds only if value is a valid number
        timeoutRef.current = setTimeout(() => {
            const newWeatherData = weatherData;
            checkForAlerts(newWeatherData);
        }, 2000); // Check for alerts after 2 seconds
    };

    const handleFetchIntervalChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setFetchInterval(value);
        }
    };

    const datasets = Object.keys(temperatureHistory.current).map(city => ({
        label: city,
        data: temperatureHistory.current[city],
        fill: false,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        tension: 0.1,
    }));

    const data = {
        labels: labels,
        datasets: datasets,
    };

    return (
        <div>
            <h2>Real-Time Weather Data</h2>
            {error && (
                <div style={{
                    color: 'red', 
                    backgroundColor: '#ffcccb', 
                    padding: '10px', 
                    marginBottom: '10px', 
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )} {/* Error message with custom style */}
            <Line data={data} />
            <div>
                <h3>Daily Summary</h3>
                <p>Average Temperature: {dailySummary.averageTemp}°C</p>
                <p>Max Temperature: {dailySummary.maxTemp}°C</p>
                <p>Min Temperature: {dailySummary.minTemp}°C</p>
                <p>Dominant Condition: {dailySummary.dominantCondition}</p>
            </div>
            <div>
                <h3>Set Alert Threshold</h3>
                <input 
                    type="number" 
                    value={alertThreshold} 
                    onChange={handleThresholdChange} 
                    placeholder="Set temperature threshold" 
                />
            </div>
            <div>
                <h3>Set Fetch Interval (seconds)</h3>
                <input 
                    type="number" 
                    onChange={handleFetchIntervalChange} 
                    placeholder="Fetch interval in seconds" 
                />
            </div>
            <div>
                <h3>Alerts</h3>
                {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <p key={index}>{alert}</p>
                    ))
                ) : (
                    <p>No alerts</p>
                )}
            </div>
        </div>
    );
};

export default WeatherChart;
