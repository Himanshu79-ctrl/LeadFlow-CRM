
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const isPublicAuthRoute =
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/login");

  if (isPublicAuthRoute) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});


export default api;
