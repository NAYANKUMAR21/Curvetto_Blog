require('dotenv').config();
const express = require('express');
const UserModel = require('../model/User.model');
const app = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = Number(process.env.SALT_ROUNDS);
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkUser = await UserModel.findOne({ username: username });

    if (checkUser && password.length > 4) {
      return bcrypt.compare(
        password,
        checkUser.password,
        function (err, result) {
          // result == true
          if (err) {
            return res.status(401).send({ message: 'Authentication failed' });
          }
          const accessToken = jwt.sign(
            { userId: checkUser._id },
            process.env.JWT_KEY
          );
          const refreshToken = jwt.sign(
            { userId: checkUser._id },
            process.env.JWT_REFRESH_SECRET_KEY
          );

          res
            .status(200)
            .send({ message: 'Login Sucessfully', accessToken, refreshToken });
        }
      );
    }
    return res.status(401).send({ message: 'User does not exist' });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

app.post('/signup', async (req, res) => {
  const { name, username, password, birthdate } = req.body;
  try {
    const checkUser = await UserModel.findOne({ username: username });

    if (checkUser) {
      return res
        .status(409)
        .send({ message: 'User aleady present with that user name' });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return res.status(400).send({
          message: 'Something wrong happened enter password again',
          err: err.message,
        });
      }
      let userCreated = await UserModel.create({
        name,
        username,
        password: hash,
        birthdate,
      });
      const accessToken = jwt.sign(
        { userId: userCreated._id },
        process.env.JWT_KEY
      );
      const refreshToken = jwt.sign(
        { userId: userCreated._id },
        process.env.JWT_REFRESH_SECRET_KEY
      );

      return res
        .status(201)
        .send({ message: 'Signup successfully', accessToken, refreshToken });
    });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

app.get('/', async (req, res) => {
  const getAll = await UserModel.find();
  return res.status(200).send(getAll);
});
module.exports = app;
