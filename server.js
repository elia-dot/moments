const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const connectDb = require('./config/db');

const app = express();

connectDb();

app.use(express.json({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/posts', postRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
