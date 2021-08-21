import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPosts } from '../actions/posts';
import Posts from './posts/Posts';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';
import AddPost from './posts/AddPost';

const Home = ({ getPosts, posts, auth }) => {
  let filteredPosts = [];
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  if (auth.isAuthenticated) {
    filteredPosts = posts.posts.filter((post) =>
      auth.user.following.includes(post.user._id)
    );
  }
  if (!posts || posts.loading) {
    <Flex width="100%" height="100vh" align="center" justify="center">
      <Spinner color="teal" size="lg" emptyColor="gray.200" />
    </Flex>;
  }
  return (
    <>
      <Container maxW="container.md">
        {auth.isAuthenticated && <AddPost />}
        <Tabs isLazy isFitted colorScheme="teal" mt="5">
          <TabList>
            <Tab>All Posts</Tab>
            <Tab>Friends Posts</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Posts posts={posts.posts} />
            </TabPanel>
            <TabPanel>
              {!auth.isAuthenticated ? (
                <Text align="center" fontSize="1.5em">
                  <Link to="/login" style ={{color : "#4FD1C5"}}>
                    Log in{' '}
                  </Link>{' '}
                  to your account to see posts from your friends.
                </Text>
              ) : filteredPosts.length === 0 ? (
                <Text align="center" fontSize="1.5em">
                  Nothing to show here, follow other users to see their posts
                  here.
                </Text>
              ) : (
                <Posts posts={filteredPosts} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
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
