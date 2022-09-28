import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { HomePage, NotFoundPage } from './app/pages';
import { NavBar } from './app/components';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
