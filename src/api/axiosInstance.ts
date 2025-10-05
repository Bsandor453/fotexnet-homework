import axios from 'axios';

const FOTEX_EXAM_API_BASE_URL = 'https://exam.api.fotex.net';

const axiosInstance = axios.create({
  baseURL: FOTEX_EXAM_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
