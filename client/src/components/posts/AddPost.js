import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormLabel,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/hooks';

import { addPost } from '../../actions/posts';

const AddPost = ({ addPost }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ text: '', game: '', video: '' });
  const hiddenFileInput = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const uploadVideo = async (file) => {
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'vntewd1c');
    let videoUrl;
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/youvid052/upload',
        fd
      );
      videoUrl = res.data.url;
    } catch (err) {
      console.log(err.message);
    }
    setFormData({ ...formData, video: videoUrl });
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost(formData);
    onClose();
  };
  return (
    <>
      <Button
        colorScheme="teal"
        leftIcon={<EditIcon />}
        ml="50%"
        transform="translateX(-50%)"
        mt="5"
        onClick={onOpen}
      >
        Add new post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add new post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Say somthing about this video...</FormLabel>
                <Input
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel mt="5">what game this video related to?</FormLabel>
                <Input
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                colorScheme="teal"
                opacity="0.9"
                ml="50%"
                transform="translateX(-50%)"
                mt="5"
                onClick={handleClick}
                isLoading={loading}
                loadingText="uploading"
              >
                {' '}
                Upload video
              </Button>
              <FormControl>
                <Input
                  type="file"
                  ref={hiddenFileInput}
                  display="none"
                  name="video"
                  onChange={(e) => uploadVideo(e.target.files[0])}
                  required
                />
              </FormControl>
              {formData.video.split('/')[8]}
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={loading}
                type="submit"
                colorScheme="teal"
                mr={3}
              >
                Post
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

AddPost.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(AddPost);
