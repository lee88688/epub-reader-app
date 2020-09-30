import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './views/reader/readerSlice';

export default configureStore({
  reducer: {
    reader: readerReducer
  }
});
