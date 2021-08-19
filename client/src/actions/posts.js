import axios from 'axios';

import {
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST,
  LIKE_POST,
  POSTS_ERROR,
  COMMENT_ON_POST,
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from './types';

import {setAlert} from './alert'

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/`);
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const getPostById = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const addPost = (data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/posts', data, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post created!', 'success'))
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
    dispatch(setAlert('Post deleted!', 'info'))
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const getPostByUser = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/${id}/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POSTS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/like/${id}`);
    dispatch({
      type: LIKE_POST,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'error'))
  }
};

export const commentOnPost = (id, data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post(`/posts/comment/${id}`, data, config);
    dispatch({
      type: COMMENT_ON_POST,
      payload: { id, comments: res.data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'error'))
  }
};

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: DELETE_COMMENT,
      payload: { postId, comments: res.data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'error'))
  }
};

export const updateComment = (postId, commentId, data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.patch(
      `/posts/comment/${postId}/${commentId}`,
      data,
      config
    );
    dispatch({
      type: UPDATE_COMMENT,
      payload: { postId, comments: res.data },
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, 'error'))
  }
};
