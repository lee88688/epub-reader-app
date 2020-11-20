import axios from 'axios';
import Cookies from 'js-cookie';
import store from './store';
import { addSnackbar } from './store/notifierSlice';

const service = axios.create({});

service.interceptors.request.use(
  config => {
    const csrfToken = Cookies.get('csrfToken');
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 0) {
      store.dispatch(addSnackbar({
        message: res.msg,
        options: { variant: 'error' }
      }));
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  error => {
    store.dispatch(addSnackbar({
      message: error.toString(),
      options: { variant: 'error' }
    }));
    return Promise.reject(error);
  }
);

export default service;
