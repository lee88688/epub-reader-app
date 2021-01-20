import request from '../request';

export function login({ email, password }) {
  return request({
    method: 'POST',
    url: '/api/user/login',
    data: { email, password }
  });
}

export function logout() {
  return request({
    method: 'POST',
    url: '/api/user/logout'
  });
}
