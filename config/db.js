const mongoose = require('mongoose');

const db = process.env.mongoURI
const connectDb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.mesage);
    process.exit(1);
  }
};

module.exports = connectDb;
