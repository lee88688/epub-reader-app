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

export function apiGetBooks() {
  return request({
    url: '/api/book',
    method: 'GET'
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
