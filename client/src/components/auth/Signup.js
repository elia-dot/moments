import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';

import { signup } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const Signup = ({ signup, alerts, setAlert }) => {
  const history = useHistory();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    games: '',
  });
  const { name, email, password, passwordConfirm, games } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setAlert('Passwords do not match', 'error');
    } else {
      signup({ name, email, password, games });
    }
  };

  useEffect(() => {
    alerts.forEach((alert) =>
      toast({
        title: alert.msg,
        status: alert.alertType,
        isClosable: true,
      })
    );
    alerts.length > 0 && alerts[0].alertType === 'success' && history.push('/');
  }, [alerts, toast, history]);

  return (
    <Container maxW="container.sm">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" textAlign="center" marginTop="10">
          <Text fontSize="3xl" fontWeight="bold" color="teal" marginBottom="5">
            SIGN UP
          </Text>

          <FormControl isRequired marginBottom="3">
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired marginBottom="3">
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl marginBottom="3">
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl marginBottom="3">
            <FormLabel>Confirm Password:</FormLabel>
            <Input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired marginBottom="3">
            <FormLabel>Games you play:</FormLabel>
            <Input
              type="text"
              name="games"
              value={games}
              onChange={handleChange}
            />
            <FormHelperText textAlign="start">
              Please use comma separated values (e.g. overwatch, call of duty)
            </FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Sign up
          </Button>
        </Flex>
      </form>
    </Container>
  );
};

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  alerts: PropTypes.array.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStatetoProps, { signup, setAlert })(Signup);
