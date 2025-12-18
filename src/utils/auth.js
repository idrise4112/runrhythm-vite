import { request } from "../api/apiClient";


export function registerUser(email, password, name) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}


export function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    
    localStorage.setItem("token", data.token);
    return data;
  });
}


export function getToken() {
  return localStorage.getItem("token");
}


export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
