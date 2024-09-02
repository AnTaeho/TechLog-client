import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.209.59.18:8081',
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
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
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        try {
          // Refresh the tokens using the refresh token
          const response = await axiosInstance.post(
            `/users/reissue?refreshToken=${refreshToken}`
          );
          const { accessToken, refreshToken: newRefreshToken, userId } = response.data.result;

          // Save the new tokens and userId
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          if (userId) {
            localStorage.setItem('userId', userId); // userId 저장
          }

          processQueue(null, accessToken);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Clear tokens and redirect to login on failure
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId'); // userId 제거
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue the requests that are made while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          console.error('Request retry failed:', err);
          return Promise.reject(err);
        });
    }

    // Additional error logging for other 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized:', error.response.data.error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
