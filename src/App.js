import React from 'react';
import {
  Switch,
  Route,
  useHistory
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './views/login';
import Bookshelf from './views/bookshelf';
import Reader from './views/reader';
import Notifier from './views/Notifier';
import Index from './views/Index';
import Cookies from 'js-cookie';

function App() {
  const history = useHistory();
  const isLogin = Cookies.get('isLogin');
  if (!isLogin) {
    history.replace('/login');
  }


  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Notifier />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/bookshelf">
          <Bookshelf />
        </Route>
        <Route path="/reader">
          <Reader />
        </Route>
        <Route exact path="/">
          <Index />
        </Route>
      </Switch>
    </SnackbarProvider>
  );
}

export default App;
