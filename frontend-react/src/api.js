import axios from "axios";

const getAuthHeader = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (!username || !password) return {};
  const token = btoa(`${username}:${password}`);
  return { Authorization: `Basic ${token}` };
};

const api = axios.create({
  baseURL: "http://localhost:8087/api",
    withCredentials: true, // ✅ This line is IMPORTANT
});

api.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    ...getAuthHeader(),
  };
  return config;
});

export default api;