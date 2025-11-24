const SERVER = import.meta.env.VITE_BACKEND_URL;

export async function registerUser(username, password) {
  const res = await fetch(`${SERVER}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.ok;
}

export async function loginUser(username, password) {
  const res = await fetch(`${SERVER}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) return null;
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data.token;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logoutUser() {
  localStorage.removeItem('token');
}