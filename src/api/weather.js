export const KYIV = { name: 'Київ, Україна', latitude: 50.45, longitude: 30.52 };

const WEATHER_CODES = {
  0: { text: 'Ясно', icon: 'clear' },
  1: { text: 'Переважно ясно', icon: 'partly' },
  2: { text: 'Мінлива хмарність', icon: 'partly' },
  3: { text: 'Хмарно', icon: 'cloudy' },
  45: { text: 'Туман', icon: 'fog' },
  48: { text: 'Паморозь', icon: 'fog' },
  51: { text: 'Легка мряка', icon: 'rain' },
  53: { text: 'Мряка', icon: 'rain' },
  55: { text: 'Сильна мряка', icon: 'rain' },
  61: { text: 'Невеликий дощ', icon: 'rain' },
  63: { text: 'Дощ', icon: 'rain' },
  65: { text: 'Сильний дощ', icon: 'rain' },
  71: { text: 'Невеликий сніг', icon: 'snow' },
  73: { text: 'Сніг', icon: 'snow' },
  75: { text: 'Сильний сніг', icon: 'snow' },
  77: { text: 'Снігові зерна', icon: 'snow' },
  80: { text: 'Зливи', icon: 'rain' },
  81: { text: 'Сильні зливи', icon: 'rain' },
  82: { text: 'Дуже сильні зливи', icon: 'rain' },
  85: { text: 'Снігопад', icon: 'snow' },
  86: { text: 'Сильний снігопад', icon: 'snow' },
  95: { text: 'Гроза', icon: 'storm' },
  96: { text: 'Гроза з градом', icon: 'storm' },
  99: { text: 'Сильна гроза з градом', icon: 'storm' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { text: 'Невідомо', icon: 'cloudy' };
}

const DIRECTIONS = ['Пн', 'ПнСх', 'Сх', 'ПдСх', 'Пд', 'ПдЗх', 'Зх', 'ПнЗх'];

function getWindDirection(degrees) {
  const index = Math.round(degrees / 45) % 8;
  return DIRECTIONS[index];
}

export async function fetchWeather(latitude, longitude) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${latitude}&longitude=${longitude}` +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    ',apparent_temperature_max,apparent_temperature_min' +
    ',sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max' +
    ',wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant' +
    '&timezone=auto&forecast_days=5';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Не вдалося завантажити дані погоди');
  }

  const data = await response.json();
  const d = data.daily;

  return d.time.map((date, i) => {
    const info = getWeatherInfo(d.weather_code[i]);
    return {
      date,
      description: info.text,
      icon: info.icon,
      tempMax: Math.round(d.temperature_2m_max[i]),
      tempMin: Math.round(d.temperature_2m_min[i]),
      feelsMax: Math.round(d.apparent_temperature_max[i]),
      feelsMin: Math.round(d.apparent_temperature_min[i]),
      wind: Math.round(d.wind_speed_10m_max[i]),
      gusts: Math.round(d.wind_gusts_10m_max[i]),
      windDirection: getWindDirection(d.wind_direction_10m_dominant[i]),
      precipitationChance: d.precipitation_probability_max[i],
      precipitationSum: d.precipitation_sum[i],
      uv: Math.round(d.uv_index_max[i]),
      sunrise: d.sunrise[i].slice(11, 16),
      sunset: d.sunset[i].slice(11, 16),
    };
  });
}

export async function getCityName(latitude, longitude) {
  try {
    const url =
      'https://api.bigdatacloud.net/data/reverse-geocode-client' +
      `?latitude=${latitude}&longitude=${longitude}&localityLanguage=uk`;
    const response = await fetch(url);
    const data = await response.json();
    const city = data.city || data.locality || data.principalSubdivision;
    if (!city) return null;
    return data.countryName ? `${city}, ${data.countryName}` : city;
  } catch {
    return null;
  }
}

export async function getLocationByIp() {
  const response = await fetch('https://ipwho.is/?lang=en');
  const data = await response.json();
  if (!data.success) {
    throw new Error('Не вдалося визначити місце за IP');
  }
  return {
    name: `${data.city}, ${data.country}`,
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

export function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокація не підтримується'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => reject(error)
    );
  });
}
