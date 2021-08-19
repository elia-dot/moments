import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/base/actions/resize';
import { max } from '@cloudinary/base/actions/roundCorners';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { AiTwotoneLike, AiOutlineLike } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import ReactPlayer from 'react-player';
import { useDisclosure } from '@chakra-ui/hooks';
import { AiFillDelete } from 'react-icons/ai';
import { RiUserFollowLine } from 'react-icons/ri';

import { cld } from '../../cloudinaryConfig';
import { likePost, commentOnPost, deletePost } from '../../actions/posts';
import { follow } from '../../actions/profile';
import Comment from './Comment';

const Post = ({
  post,
  auth: { user, isAuthenticated },
  likePost,
  commentOnPost,
  deletePost,
  alerts,
  follow,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ text: '' });
  const avatar = cld.image(post.user.photo);
  avatar.resize(fill().width(40).height(40)).roundCorners(max());

  const handleFollow = (id) => {
    follow(id);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    commentOnPost(post._id, formData);
    onClose();
  };

  return (
    <>
      <Flex direction="column" px="3" pt="3" my="3" boxShadow="lg" rounded="md">
        <Flex>
          <Box>
            <Link to={`/profile/${post.user._id}`}>
              <Flex align="center">
                <AdvancedImage cldImg={avatar} />
                <Text ml="2" fontWeight="bold" textTransform="capitalize">
                  {post.user.name}
                </Text>
                {isAuthenticated &&
                  user._id !== post.user._id && post.user.following &&
                  !post.user.following.includes(user._id) && (
                    <IconButton
                      icon={<RiUserFollowLine />}
                      colorScheme="teal"
                      variant="ghost"
                      ml="2"
                      rounded="full"
                      onClick={()=> handleFollow(post.user._id)}
                    />
                  )}
              </Flex>
            </Link>
            <Link to={`/posts/${post._id}`}>
              <Text fontSize="sm" color="gray.500">
                <Moment fromNow>{post.createdAt}</Moment>
              </Text>
            </Link>
          </Box>
          {isAuthenticated && user._id === post.user._id && (
            <>
              <Spacer />{' '}
              <IconButton
                icon={<AiFillDelete />}
                colorScheme="teal"
                variant="ghost"
                rounded="full"
                onClick={() => deletePost(post._id)}
              />
            </>
          )}
        </Flex>
        <Text my="3">{post.text}</Text>
        <Flex align="center" justify="center" position="relative" pt="56.25%">
          <ReactPlayer
            url={post.video}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </Flex>
        <Text fontSize="md" color="gray.600" my="1">
          {post.comments.length === 0 &&
            post.likes.length === 0 &&
            'Be the first one to like this post'}
        </Text>
        <Text fontSize="md" color="gray.800" my="1">
          {post.comments.length === 1
            ? `${post.comments.length} comment · `
            : post.comments.length > 1
            ? `${post.comments.length} comments · `
            : ''}
          {post.likes.length === 1
            ? `${post.likes.length} like `
            : post.likes.length > 1
            ? `${post.likes.length} likes `
            : ''}
        </Text>
        <Divider />
        <Flex w="100%">
          <Button
            w="50%"
            variant="ghost"
            colorScheme="teal"
            leftIcon={<GoComment style={{ marginTop: '0.5em' }} />}
            onClick={onOpen}
          >
            comment
          </Button>
          <Button
            leftIcon={
              user && post.likes.some((like) => like.user === user._id) ? (
                <AiTwotoneLike />
              ) : (
                <AiOutlineLike />
              )
            }
            w="50%"
            variant="ghost"
            colorScheme="teal"
            outline="none"
            onClick={() => likePost(post._id)}
          >
            like
          </Button>
        </Flex>
        <Divider />
        {post.comments.length > 0 &&
          post.comments.map((comment) => (
            <Comment postId={post._id} comment={comment} key={comment._id} />
          ))}
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Say somthing about this post</FormLabel>
                <Input
                  placeholder="Add comment..."
                  value={formData.text}
                  onChange={(e) => setFormData({ text: e.target.value })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal" mr={3}>
                Comment
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  likePost: PropTypes.func.isRequired,
  commentOnPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});

export default connect(mapStateToProps, {
  likePost,
  commentOnPost,
  deletePost,
  follow,
})(Post);
