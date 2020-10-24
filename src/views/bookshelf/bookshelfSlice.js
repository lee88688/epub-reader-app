import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetBooks } from '../../api/file';
import { apiGetCategories } from '../../api/category';

const fetchBooksByCategory = createAsyncThunk(
  'bookshelf/setCategory',
  async (category) => {
    console.log(category);
    const { data = [] } = await apiGetBooks();
    return data;
  }
);

export const bookshelfSlice = createSlice({
  name: 'bookshelf',
  initialState: {
    books: [],
    categories: [],
    category: null
  },
  reducers: {
    setBooks(state, { payload }) {
      state.books = payload;
    },
    setCategories(state, { payload }) {
      state.categories = payload;
    },
    setCategory(state, { payload }) {
      if (payload && !state.categories.some(name => name === payload)) return;
      state.category = payload;
    }
  },
  extraReducers: {
    [fetchBooksByCategory.fulfilled]: (state, { payload }) => {
      state.books = payload;
    }
  }
});

export const getBooks = () => async (dispatch, getState) => {
  const state = getState();
  const { data = [] } = await apiGetBooks(state.bookshelf.category);
  dispatch(setBooks(data));
};

export const getCategories = () => async dispatch => {
  const { data = [] } = await apiGetCategories();
  dispatch(setCategories(data));
};

export const setCategoryAndGetBooks = (name) => async (dispatch) => {
  dispatch(setCategory(name));
  dispatch(getBooks());
};

export const { setBooks, setCategories, setCategory } = bookshelfSlice.actions;

export default bookshelfSlice.reducer;

export const selectBooks = state => state.bookshelf.books;
export const selectCategories = state => state.bookshelf.categories;
export const selectCategory = state => state.bookshelf.category;
