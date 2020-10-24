import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './views/reader/readerSlice';
import bookshelfReducer from './views/bookshelf/bookshelfSlice';

export default configureStore({
  reducer: {
    reader: readerReducer,
    bookshelf: bookshelfReducer
  }
});
