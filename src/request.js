import axios from 'axios';
import store from './store';
import { addSnackbar } from './store/notifierSlice';

const service = axios.create({});

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
