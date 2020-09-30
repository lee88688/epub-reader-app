import { createSlice } from '@reduxjs/toolkit';
import { getMarks } from '../../api/mark';

export const readerSlice = createSlice({
  name: 'reader',
  initialState: {
    highlightList: []
  },
  reducers: {
    setHighlightList (state, { payload }) {
      state.highlightList = payload;
    }
  }
});

export const { setHighlightList } = readerSlice.actions;

export const getHighlightList = (bookId) => async dispatch => {
  const { data } = await getMarks(bookId);
  dispatch(setHighlightList(data));
};

export default readerSlice.reducer;

export const selectHighlightList = state => state.reader.highlightList;
