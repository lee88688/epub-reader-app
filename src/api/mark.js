import request from '../request';

export function addMark(book, { type = 'highlight', content = '', epubcfi, color, ...other } = {}) {
  if(!epubcfi || !color) throw new Error('epubcfi or color can\'t be empty.');
  return request({
    url: `/api/mark/${book}`,
    method: 'POST',
    data: { type, content, color, epubcfi, ...other }
  });
}

export function updateMark(id, book, data) {
  return request({
    url: `/api/mark/${book}/${id}`,
    method: 'PUT',
    data
  });
}

export function removeMark(id, book) {
  return request({
    url: `/api/mark/${book}/${id}`,
    method: 'DELETE'
  });
}

export function getMarks(book, type = 'highlight') {
  return request({
    url: `/api/mark/${book}`,
    method: 'GET',
    params: { type }
  });
}
