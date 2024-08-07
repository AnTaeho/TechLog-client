import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 인터셉터를 사용하여 모든 요청에 access token 추가
instance.interceptors.request.use(config => {
  const accessToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBY2Nlc3NUb2tlbiIsImV4cCI6MTcyMzM5MDA3OCwiZW1haWwiOiJhbjk4MTAyMkBuYXZlci5jb20ifQ.xFoPYQtkqifq1yRSGNCe0711s3chTw58JMrH0XkqtLsD19HyrT_D1WMOcXG77bihrLPYDZ15EPq_Yqu4rD6F2A'; // 또는 다른 저장 방법을 사용할 수 있습니다
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log(accessToken);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;
