import request from '../request';

export function uploadBook(file) {
  const form = new FormData();
  form.append('file', file);
  return request({
    url: '/api/book',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: form
  });
}

export function apiGetBooks(category) {
  return request({
    url: '/api/book',
    method: 'GET',
    params: { category }
  });
}

export function getFileUrl(fileName, path) {
  return `/book-file/${fileName}/${path}`;
}

export function getBookToc(book) {
  return request({
    url: `/api/book/toc/${book}`,
    method: 'GET'
  });
}

export function apiDeleteBook(id) {
  return request({
    url: `/api/book/${id}`,
    method: 'DELETE'
  });
}
