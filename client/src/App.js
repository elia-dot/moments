import { Container } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Global, css } from '@emotion/react';
import { useToast } from '@chakra-ui/toast';

import store from './store';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { loadUser } from './actions/auth';
import Profile from './components/profile/Profile';
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

function App({ alerts }) {
  const toast = useToast();

  useEffect(() => {
    store.dispatch(loadUser());
    alerts.forEach((alert) =>
      toast({
        title: alert.msg,
        status: alert.alertType,
        isClosable: true,
      })
    );
  }, [alerts, toast]);
  return (
    <>
      <Global styles={GlobalStyles} />
      <Container maxW="container.xl">
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/sign-up" component={Signup} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/posts/:id" component={SinglePost} />
          </Switch>
        </Router>
      </Container>
    </>
  );
}
const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(App);
