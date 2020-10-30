import { createSlice } from '@reduxjs/toolkit';

export const notifierSlice = createSlice({
  name: 'notifier',
  initialState: {
    notifications: []
  },
  reducers: {
    addSnackbar (state, { payload }) {
      state.notifications.push(payload);
    },
    dequeueSnackbar (state, { payload = 0 }) {
      if (payload === 0) return;
      state.notifications.splice(0, payload);
    }
  }
});

export default notifierSlice.reducer;

export const { addSnackbar, dequeueSnackbar } = notifierSlice.actions;

export const selectNotifications = state => state.notifier.notifications;
