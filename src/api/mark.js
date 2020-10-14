import request from '../request';

export function addMark(book, { type = 'highlight', content = '', epubcfi, color, ...other } = {}) {
  if(!epubcfi) throw new Error('epubcfi can\'t be empty.');
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

export async function getMarks(book, type = 'highlight') {
  const res = await request({
    url: `/api/mark/${book}`,
    method: 'GET',
    params: { type }
  });
  // change _id to id
  res.data = res.data.map(({ _id: id, __v, ...others }) => ({ id, ...others }));
  return res;
}
