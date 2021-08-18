import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@chakra-ui/react';
import Post from './Post';

const Posts = ({ posts }) => {
  
  return (
    <Flex width="100%" direction="column">
      {posts.map((post) => (
        <Post key={post._id} post={post}></Post>
      ))}
    </Flex>
  );
};

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default Posts;
