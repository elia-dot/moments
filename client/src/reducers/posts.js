/* eslint-disable import/no-anonymous-default-export */

import {
  COMMENT_ON_POST,
  GET_POSTS,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  LIKE_POST,
  POSTS_ERROR,
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from '../actions/types';

const initialState = {
  posts: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case POSTS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        posts: null,
      };
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    case COMMENT_ON_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id
            ? { ...post, comments: payload.comments }
            : post
        ),
        loading: false,
      };
    case DELETE_COMMENT:
    case UPDATE_COMMENT:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId
            ? { ...post, comments: payload.comments }
            : post
        ),
        loading: false,
      };
    default:
      return state;
  }
}
