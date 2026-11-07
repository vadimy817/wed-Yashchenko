function WeatherIcon({ type, size = 56 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const sun = (cx, cy, r) => (
    <g stroke="#f59e0b">
      <circle cx={cx} cy={cy} r={r} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r + 4);
        const y1 = cy + Math.sin(rad) * (r + 4);
        const x2 = cx + Math.cos(rad) * (r + 9);
        const y2 = cy + Math.sin(rad) * (r + 9);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  );

  const snowflake = (cx, cy, r) =>
    [0, 60, 120].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * r;
      const dy = Math.sin(rad) * r;
      return (
        <line
          key={`${cx}-${cy}-${angle}`}
          x1={cx - dx}
          y1={cy - dy}
          x2={cx + dx}
          y2={cy + dy}
        />
      );
    });

  const cloud = (dy = 0, color = '#64748b') => (
    <path
      stroke={color}
      d={`M20 ${44 + dy}h24a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 3 16z`}
    />
  );

  switch (type) {
    case 'clear':
      return <svg {...common}>{sun(32, 32, 10)}</svg>;

    case 'partly':
      return (
        <svg {...common}>
          {sun(24, 24, 8)}
          <g transform="translate(6 8)">
            <path
              stroke="#64748b"
              fill="white"
              d="M20 44h24a10 10 0 0 0 0-20 14 14 0 0 0-27 4 8 8 0 0 0 3 16z"
            />
          </g>
        </svg>
      );

    case 'cloudy':
      return <svg {...common}>{cloud(0)}</svg>;

    case 'fog':
      return (
        <svg {...common} stroke="#94a3b8">
          <path d="M14 22h36M10 32h44M16 42h32M22 52h20" />
        </svg>
      );

    case 'rain':
      return (
        <svg {...common}>
          {cloud(-6)}
          <g stroke="#3b82f6">
            <line x1="24" y1="44" x2="21" y2="52" />
            <line x1="33" y1="44" x2="30" y2="52" />
            <line x1="42" y1="44" x2="39" y2="52" />
          </g>
        </svg>
      );

    case 'snow':
      return (
        <svg {...common}>
          {cloud(-6)}
          <g stroke="#38bdf8" strokeWidth={2.5}>
            {snowflake(22, 50, 4)}
            {snowflake(33, 55, 4)}
            {snowflake(44, 50, 4)}
          </g>
        </svg>
      );

    case 'storm':
      return (
        <svg {...common}>
          {cloud(-6, '#475569')}
          <path stroke="#f59e0b" d="M34 42l-6 8h7l-4 8" />
        </svg>
      );

    default:
      return <svg {...common}>{cloud(0)}</svg>;
  }
}

export default WeatherIcon;
