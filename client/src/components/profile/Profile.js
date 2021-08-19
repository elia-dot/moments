import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Divider, Flex, Spinner } from '@chakra-ui/react';

import { getProfile } from '../../actions/profile';
import { getPostByUser } from '../../actions/posts';
import ProfileTop from './ProfileTop';
import Posts from '../posts/Posts';
import AddPost from '../posts/AddPost';

const Profile = ({
  getProfile,
  getPostByUser,
  match,
  profile: { profile, loading },
  posts,
  auth,
}) => {
  useEffect(() => {
    const id = match.params.id;
    getProfile(id);
    getPostByUser(id);
    // eslint-disable-next-line
  }, [getProfile, match.params.id]);

  if (!profile || loading) {
    return (
      <Flex width="100%" height="100vh" align="center" justify="center">
        <Spinner color="teal" size="lg" emptyColor="gray.200" />
      </Flex>
    );
  }
  return (
    <Container maxW="container.md">
      <ProfileTop profile={profile} />
      <Divider borderColor="telegram.100" />
      {auth.isAuthenticated && auth.user._id === profile._id && (
        <AddPost />
      )}
      <Posts posts={posts.posts} />
    </Container>
  );
};

Profile.propTypes = {
  getProfile: PropTypes.func.isRequired,
  getPostByUser: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfile, getPostByUser })(Profile);
