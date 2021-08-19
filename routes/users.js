const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../utils/auth');

//create token and cookie

const createAndSendToken = (user, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure,
  });

  res.status(201).json({ token });
};

//signup

router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('games', 'Please provide atleast one game').not().isEmpty(),
    check('email', 'Plaease provide a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, games } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }

      user = new User({ name, email, password });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      user.games = games.split(',').map((game) => game.trim().toUpperCase());

      await user.save();

      createAndSendToken(user, req, res);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//login

router.post(
  '/login',
  [
    check('email', 'Plaease provide a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      createAndSendToken(user, req, res);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// get current user

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

//delete user

router.delete('/me', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.status(204).send('User deleted');
  } catch (err) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

//get all users

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

//get user by id

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.json(500).send('Server error');
  }
});

//update user

router.put('/update-me', auth, async (req, res) => {
  const { photo, name, games } = req.body;
  const updatedUser = {};
  if (photo) updatedUser.photo = photo;
  if (name) updatedUser.name = name;
  if (games) updatedUser.games = games.split(',').map((game) => game.trim());

  try {
    const user = await User.findByIdAndUpdate(req.user.id, updatedUser, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    return res.json(500).send('Server error');
  }
});

// follow/unfollow user

router.put('/follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'You cant follow yourself' });
    }

    if (
      user.following.filter((follow) => follow.toString() === req.user.id)
        .length > 0
    ) {
      const removeIndex = user.following
        .map((follow) => follow.toString())
        .indexOf(req.user.id);

      user.following.splice(removeIndex, 1);
    } else if (
      user.following.filter((follow) => follow === req.user.id).length === 0
    ) {
      user.following.unshift(req.user.id);
    }

    await user.save();
    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
