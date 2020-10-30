import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { dequeueSnackbar, selectNotifications } from '../store/notifierSlice';


const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    notifications.forEach(({ message, options = {} }) => {
      enqueueSnackbar(message, options);
    });
    dispatch(dequeueSnackbar(notifications.length));
  }, [dispatch, notifications, enqueueSnackbar]);

  return null;
};

export default Notifier;
