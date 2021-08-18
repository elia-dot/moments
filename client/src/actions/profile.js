import axios from 'axios';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';

export const getProfile = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/users/${id}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err, status: err.response.status },
    });
  }
};

export const updateProfile = (data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put(`/users/update-me`, data, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err, status: err.response.status },
    });
  }
};

export const uploadImg = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'zipym5ei');
  let imgUrl;
  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/youvid052/upload/',
      formData
    );
    imgUrl = res.data.public_id;
  } catch (err) {
    console.log(err.message);
  }
  dispatch(updateProfile({ photo: imgUrl }));
};
