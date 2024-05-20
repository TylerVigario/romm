import axios from "axios";
import cookie from "js-cookie";

import router from "@/plugins/router";

const api = axios.create({ baseURL: "/api", timeout: 120000 });

// Set CSRF header for all requests
api.interceptors.request.use((config) => {
  config.headers["x-csrftoken"] = cookie.get("csrftoken");
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api
