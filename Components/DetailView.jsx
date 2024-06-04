import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function DetailView() {
  let { datetime } = useParams();
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await fetch(
        `http://api.weatherbit.io/v2.0/forecast/daily?city=Miami,FL&key=${API_KEY}&start_date=${datetime}&end_date=${datetime}`
      );
      const json = await response.json();
      setWeatherData(json.data[0]);
    };

    fetchWeatherData();
  }, [datetime]);

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const date = new Date(datetime);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <div className="detail-view">
      <h2>Weather Details for {formattedDate}</h2>
      <p>Temperature: {weatherData.temp}°F</p>
      <p>Wind Speed: {weatherData.wind_spd} mph</p>
      <p>Snow: {weatherData.snow}</p>
      {/* Add other weather data as needed */}
    </div>
  );
}

export default DetailView;
