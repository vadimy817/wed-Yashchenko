const COOKIE_NAME = 'auth_user';

export const VALID_LOGIN = 'vadim4';
export const VALID_PASSWORD = 'vad22gym!';

export function setCookie(name, value, days) {
  let cookie = `${name}=${encodeURIComponent(value)}; path=/`;
  if (days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    cookie += `; expires=${expires}`;
  }
  document.cookie = cookie;
}

export function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function checkCredentials(login, password) {
  return login === VALID_LOGIN && password === VALID_PASSWORD;
}

export function loginUser(login, remember) {
  setCookie(COOKIE_NAME, login, remember ? 7 : undefined);
}

export function logoutUser() {
  deleteCookie(COOKIE_NAME);
}

export function isAuthenticated() {
  return getCookie(COOKIE_NAME) !== null;
}

export function getCurrentUser() {
  return getCookie(COOKIE_NAME);
}
