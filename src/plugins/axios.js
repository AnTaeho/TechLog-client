// src/plugins/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const nonAuthEndpoints = [
    /^\/users\/.*/,  // Users related endpoints
    /^\/posts\/\d+$/, // Individual posts
    /^\/error\/.*/,   // Error pages
    /^\/$/,           // Root URL
  ];

  // Add Authorization header only for protected endpoints
  if (!nonAuthEndpoints.some((regex) => regex.test(config.url))) {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;  // Use backticks for template literal
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized error
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        try {
          // Request new tokens using the refresh token
          const response = await axios.post(`http://localhost:8081/users/reissue?refreshToken=${refreshToken}`);
          const { accessToken, refreshToken: newRefreshToken } = response.data.result;

          // Save the new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          processQueue(null, accessToken);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // If refresh fails, clear tokens and redirect to login page
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue requests that are made while the refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      }).catch(err => {
        // Additional error logging and user feedback handling
        console.error('Request retry failed:', err);
        // Optionally add user feedback logic here
        return Promise.reject(err);
      });
    }

    // Additional error logging for 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized:', error.response.data.error.message);
      // Optionally add UI state changes or user notification logic here
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
