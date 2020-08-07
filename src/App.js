import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Login from './views/login';
import Bookshelf from './views/bookshelf';
import Reader from './views/reader';

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
        <Route path="/reader">
          <Reader />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
