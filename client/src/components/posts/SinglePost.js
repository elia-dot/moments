import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPostById } from '../../actions/posts';
import Post from './Post';
import { Container, Spinner } from '@chakra-ui/react';

const SinglePost = ({ getPostById, post, match }) => {
  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById, match.params.id]);
  if (!post) return <Spinner />;
  else
    return (
      <Container maxW="container.md">
        <Post post={post}></Post>
      </Container>
    );
};

SinglePost.propTypes = {
  getPostById: PropTypes.func.isRequired,
  post: PropTypes.object,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  post: state.posts.post,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPostById,
})(SinglePost);
