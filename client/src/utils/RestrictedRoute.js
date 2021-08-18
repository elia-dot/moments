import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router';

const RestrictedRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated && !loading ? (
        <Redirect to="/" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

RestrictedRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RestrictedRoute);
