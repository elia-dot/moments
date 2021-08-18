const express = require('express');
const { check, validationResult } = require('express-validator');
const Post = require('../models/Post');

const auth = require('../utils/auth');

const router = express.Router();

//get all posts

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// get post by id

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({msg: 'Post not found'})
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//create post

router.post(
  '/',
  [
    auth,
    [
      check('game', 'video must be belong to a game').not().isEmpty(),
      check('video', 'Please provide a video').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text, video, game } = req.body;
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text,
        video,
        game,
        name: user.name,
        photo: user.photo,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.status(200).json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//delete post

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (req.user.id !== post.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    post.remove();
    res.status(204).json({ msg: 'Post deleted successfuly' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//get user posts

router.get('/:userid/posts', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userid }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//comment on post

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      const newComment = {
        text: req.body.text,
        name: user.name,
        photo: user.photo,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

//delete comment

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authrized' });
    }
    const removeIndex = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//update comment
router.patch(
  '/comment/:post_id/:comment_id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.post_id);
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authrized' });
      }

      post.comments.map((comment) => {
        if (comment._id.toString() === req.params.comment_id)
          comment.text = req.body.text;
      });

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// like/unlike post

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);
    } else if (
      post.likes.filter((like) => like.user === req.user.id).length === 0
    ) {
      post.likes.unshift({
        user: req.user.id,
        photo: req.user.photo,
        name: req.user.name,
      });
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
