import React, { useEffect, useState } from "react";
import "./Weather.css";
import axios from "axios";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function Weather() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Get city name from coordinates
          await getCityName(latitude, longitude);
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=Metric&appid=${API_KEY}`;
          fetchWeather(url);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Tel Aviv if geolocation fails
          const defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=Tel Aviv&units=Metric&appid=${API_KEY}`;
          fetchWeather(defaultUrl);
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      const defaultUrl = `https://api.openweathermap.org/data/2.5/weather?q=Tel Aviv&units=Metric&appid=${API_KEY}`;
      fetchWeather(defaultUrl);
    }
  }, []);

  const getCityName = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      if (response.data && response.data[0]) {
        setCityName(response.data[0].name);
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  const fetchWeather = async (url) => {
    try {
      const response = await axios.get(url);
      setData(response.data);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData({ notFound: true });
      } else {
        console.error(error);
        setError("Failed to fetch weather data");
      }
    }
  };

  const search = async () => {
    if (!location.trim()) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${API_KEY}`;
    await fetchWeather(url);
    setLocation(""); // clear input after search
    setCityName(""); // clear city name after search
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "Thunderstorm":
        return <i className="bx bx-cloud-lightning" />;
      case "Rain":
        return <i className="bx bx-cloud-rain" />;
      case "Snow":
        return <i className="bx bx-cloud-snow" />;
      case "Haze":
      case "Mist":
        return <i className="bx bx-cloud-water" />;
      case "Clear":
        return <i className="bx bxs-sun" />;
      case "Clouds":
        return <i className="bx bx-cloud" />;
      default:
        return <i className="bx bx-cloud" />;
    }
  };

  return (
    <div className="weather">
      <div className="search">
        <div className="search-top">
          <i className="fa-solid fa-location-dot" />
          <div className="location"> {cityName || data.name}</div>
        </div>
        <div className="search-location">
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <i className="fa-solid fa-magnifying-glass" onClick={search} />
        </div>
      </div>
      {data.notFound ? (
        <div className="not-found">Not Found 😕</div>
      ) : (
        <div className="weather-data">
          {data.weather &&
            data.weather[0] &&
            getWeatherIcon(data.weather[0].main)}
          <div className="weather-type">
            {data.weather ? data.weather[0].main : null}
          </div>
          <div className="temp">
            {data.main ? `${Math.floor(data.main.temp)}°` : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
