require('dotenv').config();
const mongoose = require('mongoose');
const connect = async () => {
  return mongoose
    .connect('mongodb://localhost:27017/testBlogs')
    .then(() => {
      console.log('Successfully connected to database');
    })
    .catch((error) => {
      console.log('database connection failed. exiting now...');
      console.error(error);
      process.exit(1);
    });
};

module.exports = connect;
