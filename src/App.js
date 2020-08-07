import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './views/login';
import Bookshelf from './views/bookshelf';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/bookshelf">
          <Bookshelf />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
