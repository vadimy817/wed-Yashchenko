import WeatherIcon from './WeatherIcon.jsx';

function WeatherCard({
  date,
  isToday,
  description,
  icon,
  tempMax,
  tempMin,
  feelsMax,
  feelsMin,
  wind,
  gusts,
  windDirection,
  precipitationChance,
  precipitationSum,
  uv,
  sunrise,
  sunset,
}) {
  const dayName = new Date(date).toLocaleDateString('uk-UA', { weekday: 'long' });
  const dayDate = new Date(date).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className={isToday ? 'weather-card today' : 'weather-card'}>
      <div className="card-top">
        <p className="card-day">{isToday ? 'Сьогодні' : dayName}</p>
        <p className="card-date">{dayDate}</p>
      </div>

      <div className="card-main">
        <WeatherIcon type={icon} />
        <p className="temp">
          {tempMax}°<span> / {tempMin}°</span>
        </p>
      </div>
      <p className="weather-description">{description}</p>

      <dl className="details">
        <div>
          <dt>Відчувається</dt>
          <dd>
            {feelsMax}° / {feelsMin}°
          </dd>
        </div>
        <div>
          <dt>Вітер</dt>
          <dd>
            {wind} км/год, {windDirection}
          </dd>
        </div>
        <div>
          <dt>Пориви</dt>
          <dd>до {gusts} км/год</dd>
        </div>
        <div>
          <dt>Опади</dt>
          <dd>
            {precipitationChance}% ({precipitationSum} мм)
          </dd>
        </div>
        <div>
          <dt>УФ-індекс</dt>
          <dd>{uv}</dd>
        </div>
        <div>
          <dt>Схід сонця</dt>
          <dd>{sunrise}</dd>
        </div>
        <div>
          <dt>Захід сонця</dt>
          <dd>{sunset}</dd>
        </div>
      </dl>
    </div>
  );
}

export default WeatherCard;
