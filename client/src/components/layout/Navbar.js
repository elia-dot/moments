import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Flex,
  Spacer,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/base/actions/resize';
import { max } from '@cloudinary/base/actions/roundCorners';

import { cld } from '../../cloudinaryConfig';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const avatar = user && cld.image(user.photo);
  avatar && avatar.resize(fill().width(40).height(40)).roundCorners(max());
  const authLinks = (
    <Flex>
      <Flex align="center">
        {user && (
          <Text textTransform="capitalize" fontWeight="medium" mr="1">
            {' '}
            {user.name.split(' ')[0]}
          </Text>
        )}
        {user && (
          <Link to={`/profile/${user._id}`}>
            <AdvancedImage cldImg={avatar} />
          </Link>
        )}
      </Flex>
      <Menu>
        <MenuButton
          ml="2"
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList>
          <MenuItem>
            {user && (
              <Link to={`/profile/${user._id}`}> Go to your profile </Link>
            )}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
  const guestLinks = (
    <Flex>
      <Link to="/login">
        <Button
          mr="4"
          colorScheme="teal"
          textTransform="uppercase"
          variant="outline"
        >
          Login
        </Button>
      </Link>
      <Link to="/sign-up">
        <Button colorScheme="teal" textTransform="uppercase">
          Signup
        </Button>
      </Link>
    </Flex>
  );
  return (
    <Flex paddingBottom="1" paddingTop="5" borderBottom="1px solid teal">
      <Box fontSize="2xl" fontWeight="black">
        <Link to="/">YouVid</Link>
      </Box>
      <Spacer />
      {!loading && <> {isAuthenticated ? authLinks : guestLinks}</>}
    </Flex>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
