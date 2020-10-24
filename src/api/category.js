import request from '../request';

export function apiGetCategories() {
  return request({
    url: '/api/category',
    method: 'GET'
  });
}

export function apiCreateCategory(name) {
  return request({
    url: '/api/category',
    method: 'POST',
    data: { name }
  });
}

export function apiAddBooksToCategory(name, books) {
  return request({
    url: '/api/category/add-books',
    method: 'POST',
    data: { name, books }
  });
}

export function apiRemoveBooksFromCategory(name, books) {
  return request({
    url: '/api/category/remove-books',
    method: 'POST',
    data: { name, books }
  });
}

export function apiRemoveCategory(name) {
  return request({
    url: '/api/category/delete',
    method: 'POST',
    data: { name }
  });
}
