const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return res
    .json()
    .catch(() => ({}))
    .then((data) => {
      const message =
        data.error || data.message || `Error ${res.status}`;
      return Promise.reject(new Error(message));
    });
}


export function request(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    
    credentials: "include",
    ...options,
  }).then(checkResponse); 
}

const SERVER = import.meta.env.VITE_BACKEND_URL;

