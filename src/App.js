import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './views/login';
import Bookshelf from './views/bookshelf';
import Reader from './views/reader';
import Notifier from './views/Notifier';

function App() {
  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Notifier />
      <Router>
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
        </Switch>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
