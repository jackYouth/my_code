import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from './App';
import Home from './components/home';

const Routes = (
  <Router history={ hashHistory }>
    <Route path='/' component={ App } >
      <IndexRoute component={ Home } />
    </Route>
  </Router>
)


export default Routes
