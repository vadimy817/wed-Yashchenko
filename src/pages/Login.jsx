import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { checkCredentials, loginUser, isAuthenticated } from '../utils/auth.js';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (login.trim() === '' || password.trim() === '') {
      setError('Заповніть обидва поля');
      return;
    }

    if (!checkCredentials(login.trim(), password.trim())) {
      setError('Невірний логін або пароль');
      return;
    }

    setError('');
    loginUser(login.trim(), remember);
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вхід</h2>

        <label htmlFor="login">Логін</label>
        <input
          id="login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Наприклад, mark5"
        />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введіть пароль"
        />

        <label className="remember" htmlFor="remember">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Запам'ятати мене
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Увійти</button>
      </form>
    </div>
  );
}

export default Login;
