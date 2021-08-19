import axios from 'axios';
import { setAlert } from './alert';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/users/me');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const signup =
  ({ name, email, password, games }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password, games });

    try {
      const res = await axios.post('/users/signup', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
      dispatch(setAlert('Account created!', 'success'));
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/users/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Logged in successfuly!', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get('users/logout')
    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    
    dispatch({
      type: AUTH_ERROR,
    });
  }
  
  // (function () {
  //   var cookies = document.cookie.split('; ');
  //   for (let c = 0; c < cookies.length; c++) {
  //     const d = window.location.hostname.split('.');
  //     while (d.length > 0) {
  //       const cookieBase =
  //         encodeURIComponent(cookies[c].split(';')[0].split('=')[0]) +
  //         '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' +
  //         d.join('.') +
  //         ' ;path=';
  //       const p = window.location.pathname.split('/');
  //       document.cookie = cookieBase + '/';
  //       while (p.length > 0) {
  //         document.cookie = cookieBase + p.join('/');
  //         p.pop();
  //       }
  //       d.shift();
  //     }
  //   }
  // })();
};
