import axios from 'axios';

const service = axios.create({});

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 0) {
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
