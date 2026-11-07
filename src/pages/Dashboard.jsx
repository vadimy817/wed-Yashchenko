import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import {
  fetchWeather,
  getUserPosition,
  getCityName,
  getLocationByIp,
  KYIV,
} from '../api/weather.js';
import { logoutUser, getCurrentUser } from '../utils/auth.js';

function Dashboard() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      let place;

      try {
        const coords = await getUserPosition();
        const name = await getCityName(coords.latitude, coords.longitude);
        place = {
          name: name || `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
      } catch {
        try {
          place = await getLocationByIp();
          setNotice('Геолокацію браузера не отримано, місце визначено за IP-адресою');
        } catch {
          place = KYIV;
          setNotice('Геолокація недоступна, показано погоду для Києва');
        }
      }
      setLocation(place);

      try {
        const data = await fetchWeather(place.latitude, place.longitude);
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-inner">
          <span className="logo">Погода</span>
          <div className="header-right">
            <span className="user">{getCurrentUser()}</span>
            <button className="logout" onClick={handleLogout}>
              Вийти
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        <section className="title-block">
          <h1>{location ? location.name : 'Визначаємо місцезнаходження...'}</h1>
          <p className="subtitle">Прогноз погоди на 5 днів</p>
          {notice && <p className="notice">{notice}</p>}
        </section>

        {loading && <Loader />}
        {error && <p className="error">{error}</p>}

        {!loading && (
          <div className="weather-list">
            {weather.map((day, index) => (
              <WeatherCard
                key={day.date}
                date={day.date}
                isToday={index === 0}
                description={day.description}
                icon={day.icon}
                tempMax={day.tempMax}
                tempMin={day.tempMin}
                feelsMax={day.feelsMax}
                feelsMin={day.feelsMin}
                wind={day.wind}
                gusts={day.gusts}
                windDirection={day.windDirection}
                precipitationChance={day.precipitationChance}
                precipitationSum={day.precipitationSum}
                uv={day.uv}
                sunrise={day.sunrise}
                sunset={day.sunset}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
