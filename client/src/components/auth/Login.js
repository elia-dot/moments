import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';

import { login } from '../../actions/auth';

const Login = ({ login, alerts }) => {
  const history = useHistory();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  useEffect(() => {
    alerts.length > 0 &&
      alerts[0].alertType === 'success' &&
      setTimeout(() => {
        history.push('/');
      }, 1000);
  }, [alerts, toast, history]);

  return (
    <Container maxW="container.sm">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" textAlign="center" marginTop="10">
          <Text fontSize="3xl" fontWeight="bold" color="teal" marginBottom="5">
            LOGIN
          </Text>

          <FormControl isRequired marginBottom="3">
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired marginBottom="3">
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </FormControl>
          <Text color="teal.400" marginBottom="3">
            Forgot password?
          </Text>
          <Button type="submit" colorScheme="teal">
            Login
          </Button>
        </Flex>
      </form>
    </Container>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  alerts: PropTypes.array.isRequired,
};

const mapStatetoProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStatetoProps, { login })(Login);
