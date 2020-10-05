import { createSlice } from '@reduxjs/toolkit';
import { getMarks } from '../../api/mark';

export const readerSlice = createSlice({
  name: 'reader',
  initialState: {
    highlightList: [],
    bookmarkList: []
  },
  reducers: {
    setHighlightList(state, { payload }) {
      state.highlightList = payload;
    },
    setBookmarkList(state, { payload }) {
      state.bookmarkList = payload;
    }
  }
});

export const { setHighlightList, setBookmarkList } = readerSlice.actions;

export const getHighlightList = (bookId) => async dispatch => {
  const { data } = await getMarks(bookId);
  dispatch(setHighlightList(data));
};

export const getBookmarkList = (bookId) => async dispatch => {
  const { data } = await getMarks(bookId, 'bookmark');
  dispatch(setBookmarkList(data));
};

export const getMarkList = bookId => async dispatch => {
  const { data } = await getMarks(bookId, '');
  const highlightList = [];
  const bookmarkList = [];
  data.forEach(item => {
    if (item.type === 'highlight') {
      highlightList.push(item);
    } else if (item.type === 'bookmark') {
      bookmarkList.push(item);
    }
  });
  dispatch(setHighlightList(highlightList));
  dispatch(setBookmarkList(bookmarkList));
};

export default readerSlice.reducer;

export const selectHighlightList = state => state.reader.highlightList;
export const selectBookmarkList = state => state.reader.bookmarkList;
