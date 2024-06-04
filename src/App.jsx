import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import WindSpeedChart from '/Users/brandonwetzel/github-classroom/COP4808-Spring2024-Full-Stack-Webdev/hw6-BwetzelFAU/WeatherApp2.0/Components/windspeed.jsx';
import DetailView from '/Users/brandonwetzel/github-classroom/COP4808-Spring2024-Full-Stack-Webdev/hw6-BwetzelFAU/WeatherApp2.0/Components/DetailView.jsx';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [numDays, setNumDays] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // ...
  }, []);

  const handleItemClick = (item) => {
    window.location.href = `/detail/${item.datetime}`;
  };

  const fetchWeatherData = async (city, state) => {
    const response = await fetch(
      `http://api.weatherbit.io/v2.0/forecast/daily?city=${city},${state}&key=${API_KEY}&days=10&units=I`
    );
    const json = await response.json();
    setWeatherData(json.data);
    setCurrentCity(city);
  };

  const handleSearch = () => {
    fetchWeatherData(searchInput).catch(console.error);
    setHasSearched(true);
  };

  const handleNumDaysChange = (event) => {
    setNumDays(event.target.value);
  };

  const minTemp = Math.min(...weatherData.map(item => item.temp));
  const maxTemp = Math.max(...weatherData.map(item => item.temp));

  return (
    <Router>
      <div className="whole-page">
        <h1>World-Wide Weather Forecast</h1>
        <h2>City: {currentCity}</h2>

        {weatherData.length > 0 && <WindSpeedChart data={weatherData} />}

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. Miami, Florida" 
            />
            <button onClick={handleSearch}>Search</button>
        </form>

        {hasSearched && weatherData.length > 0 && (
            <Routes>
              <Route path="/" element={
                <div className="content-container">
                  <div className="temp-container">
                    <p>Current Temperature: {weatherData[0].temp.toFixed(2)}°F</p>
                    <p>Minimum Temperature: {minTemp}°F</p>
                    <p>Maximum Temperature: {maxTemp}°F</p>
                  </div>

                  <div className="weather-data">
                    <h3>This week's forecast:</h3>

                    <label>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        value={numDays}
                        onChange={handleNumDaysChange}
                      />
                    </label>

                    <ul>
  {weatherData.slice(0, numDays).map((item, index) => {
    const date = new Date(item.datetime);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;

    return (
      <li key={index} className="date-item">
        <Link to={`/detail/${item.datetime}`}>
          {formattedDate} <br/> {item.temp}°F &nbsp; {item.weather.description}
        </Link>
      </li>
    );
  })}
</ul>
                  </div>
                </div>
              } />
              <Route path="/detail/:datetime" element={<DetailView />} />
            </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;