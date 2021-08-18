import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MdModeEdit } from 'react-icons/md';
import {
  Flex,
  Text,
  Box,
  HStack,
  StackDivider,
  Tag,
  Button,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
  FormLabel,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/base/actions/resize';
import { max } from '@cloudinary/base/actions/roundCorners';
import { useDisclosure } from '@chakra-ui/hooks';
import { BiImageAlt } from 'react-icons/bi';

import { cld } from '../../cloudinaryConfig';
import { updateProfile } from '../../actions/profile';
import { uploadImg } from '../../actions/profile';

const ProfileTop = ({
  profile: { profile },
  auth: { isAuthenticated, user: authUser },
  updateProfile,
  uploadImg
}) => {
  const hiddenFileInput = React.useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: profile.name,
    games: profile.games.join(', '),
  });
  const profileImg = cld.image(profile.photo);
  profileImg.resize(fill().width(200).height(200)).roundCorners(max());

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };
  return (
    <Flex
      direction="column"
      align="center"
      py="10"
      style={{ position: 'relative' }}
    >
      <Box mb="4" position="relative">
        <Tooltip label="change profile picture" hasArrow bg="teal">
          <Box position="absolute" right="0" bottom="5">
            <IconButton
              icon={<BiImageAlt />}
              colorScheme="teal"
              rounded="full"
              fontSize="1.5em"
              opacity="0.9"
              onClick={handleClick}
            />
            <FormControl>
              <Input
                type="file"
                onChange={(e) => uploadImg(e.target.files[0])}
                ref={hiddenFileInput}
                display="none"
              />
            </FormControl>
          </Box>
        </Tooltip>
        <AdvancedImage cldImg={profileImg} />
      </Box>

      <Text mb="4" fontSize="3xl" fontWeight="bold" textTransform="capitalize">
        {profile.name}
      </Text>
      <HStack
        divider={<StackDivider borderColor="teal.100" />}
        spacing={3}
        align="center"
      >
        {profile.games.map((game, i) => (
          <Tag key={i} colorScheme="teal" variant="outline">
            {game}
          </Tag>
        ))}
      </HStack>
      {isAuthenticated && profile._id === authUser._id && (
        <Button
          variant="outline"
          colorScheme="teal"
          style={{ position: 'absolute', right: 0 }}
          onClick={onOpen}
        >
          {' '}
          <MdModeEdit />
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit your profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Name:</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel mt="5">Games:</FormLabel>
                <Input
                  name="games"
                  value={formData.games}
                  onChange={handleChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="teal" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Flex>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  uploadImg: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { updateProfile, uploadImg })(ProfileTop);
