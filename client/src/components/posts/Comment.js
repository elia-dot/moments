import React, { useState } from 'react';
import {
  Divider,
  Flex,
  Spacer,
  Text,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
  Button,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/base/actions/resize';
import { max } from '@cloudinary/base/actions/roundCorners';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MdModeEdit } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import { useDisclosure } from '@chakra-ui/hooks';
import { RiUserFollowLine } from 'react-icons/ri';

import { cld } from '../../cloudinaryConfig';
import { deleteComment, updateComment } from '../../actions/posts';
import { follow } from '../../actions/profile';

const Comment = ({
  postId,
  comment: { text, user, createdAt, _id: commentId },
  auth: { isAuthenticated, user: authUser },
  deleteComment,
  updateComment,
  follow,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ text: text });
  const avatar = cld.image(user.photo);
  avatar.resize(fill().width(40).height(40)).roundCorners(max());

  const handleFollow = (id) => {
    follow(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateComment(postId, commentId, formData);
    onClose();
  };

  if (!user) {
    return (
      <Flex width="100%" height="100vh" align="center" justify="center">
        <Spinner color="teal" size="lg" emptyColor="gray.200" />
      </Flex>
    );
  }
  return (
    <>
      <Flex direction="column" px="3" pt="3" my="3">
        <Flex>
          <Link to={`/profile/${user._id}`}>
            <Flex align="center">
              <AdvancedImage cldImg={avatar} />
              <Text ml="2" fontWeight="bold" textTransform="capitalize">
                {user.name}
              </Text>
            </Flex>
          </Link>
          {isAuthenticated &&
            authUser._id !== user._id &&
            !authUser.following.includes(user._id) && (
              <Tooltip label={`Follow ${user.name}`} hasArrow bg="teal">
                <IconButton
                  icon={<RiUserFollowLine />}
                  colorScheme="teal"
                  variant="ghost"
                  ml="2"
                  rounded="full"
                  onClick={() => handleFollow(user._id)}
                />
              </Tooltip>
            )}
          {isAuthenticated && user._id === authUser._id && (
            <>
              <Spacer />{' '}
              <Menu>
                <MenuButton
                  as={IconButton}
                  ml="2"
                  aria-label="Options"
                  icon={<ChevronDownIcon />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem>
                    <Flex align="center" onClick={() => onOpen()}>
                      <MdModeEdit style={{ marginRight: '1em' }} />
                      Edit comment
                    </Flex>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      deleteComment(postId, commentId);
                    }}
                  >
                    <Flex align="center">
                      <AiFillDelete style={{ marginRight: '1em' }} />
                      Delete comment
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </Flex>
        <Text fontSize="sm" color="gray.500">
          <Moment fromNow>{createdAt}</Moment>
        </Text>
        <Text my="3">{text}</Text>
        <Divider />
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Input
                  placeholder="Edit comment..."
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

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteComment,
  updateComment,
  follow,
})(Comment);
