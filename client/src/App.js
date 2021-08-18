import { Container } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import store from './store';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { loadUser } from './actions/auth';
import { Provider } from 'react-redux';
import Profile from './components/profile/Profile';
import PrivetRoute from './utils/PrivetRoute';
import RestrictedRoute from './utils/RestrictedRoute';
import { Global, css } from '@emotion/react'
import SinglePost from './components/posts/SinglePost';

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus    via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
     outline: none;
     box-shadow: none;
   }
`;

function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Global styles={GlobalStyles} />
      <Container maxW="container.xl">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <RestrictedRoute exact path="/login" component={Login} />
            <RestrictedRoute exact path="/sign-up" component={Signup} />
            <PrivetRoute exact path="/profile/:id" component={Profile} />
            <Route exact path="/posts/:id" component={SinglePost} />
          </Switch>
        </Router>
      </Container>
    </Provider>
  );
}

export default App;
