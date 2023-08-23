require('dotenv').config();
const { Router } = require('express');
const BlogModel = require('../model/blog.model');
const app = Router();
const jwt = require('jsonwebtoken');
let JWT_KEY = process.env.JWT_REFRESH_SECRET_KEY;
app.post('/post-blog', async (req, res) => {
  const { title, body, image } = req.body;
  const token = req.headers.authorization;
  try {
    console.log(req.headers, JWT_KEY);
    let x = jwt.verify(token, JWT_KEY);
    console.log(x);
    await BlogModel.create({
      title: title,
      userId: x.userId,
      body: body,
      likes: 0,
      comments: [],
      dislikes: 0,
      avatar: image,
    });
    return res.status(201).send({ message: 'Blog Successfully added' });
  } catch (er) {
    console.log(er);
    return res.status(400).send({ message: er.message });
  }
});

app.get('/all-blogs', async (req, res) => {
  try {
    console.log('heres', req);
    const getAlll = await BlogModel.find().populate([
      { path: 'userId', select: ['username', 'birthdate'] },
      { path: 'comments', populate: { path: 'userId', select: ['username'] } },
    ]);

    return res.status(200).send(getAlll);
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});

app.get('/single-blog/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('heres', req);
    const getAlll = await BlogModel.findOne({ _id: id }).populate([
      { path: 'userId', select: ['username', 'birthdate'] },
      { path: 'comments', populate: { path: 'userId', select: ['username'] } },
    ]);
    console.log(getAlll);
    return res.status(200).send(getAlll);
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});
module.exports = app;
