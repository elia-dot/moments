import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getPosts } from '../actions/posts';
import Posts from './posts/Posts';
import { Container, Flex, Spinner } from '@chakra-ui/react';
import AddPost from './posts/AddPost';

const Home = ({ getPosts, posts, auth }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  if (!posts || posts.loading) {
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Spinner color="teal" size="lg" emptyColor="gray.200" />
    </Flex>;
  }
  return (
    <>
      <Container maxW="container.md">
        {auth.isAuthenticated && <AddPost />}
        <Posts posts={posts.posts} />
      </Container>
    </>
  );
};

Home.propTypes = {
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts })(Home);
