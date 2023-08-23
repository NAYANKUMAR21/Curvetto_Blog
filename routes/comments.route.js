const { Router } = require('express');
const CommentsModel = require('../model/comments.model');
const BlogModel = require('../model/blog.model');
const app = Router();
const jwt = require('jsonwebtoken');
let JWT_KEY = process.env.JWT_KEY;
app.post('/add-comment', async (req, res) => {
  const { blogId, comment } = req.body;
  const token = req.headers.authorization;
  let x = jwt.verify(token, JWT_KEY);
  try {
    let commentAdded = await CommentsModel.create({
      userId: x.userId,
      text: comment,
      likes: 0,
      dislikes: 0,
    });
    await BlogModel.findByIdAndUpdate(
      { _id: blogId },
      { $push: { comments: commentAdded._id } },
      { new: true }
    );
    return res.status(201).send({ message: 'Successfully created' });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});

app.get('/', (req, res) => {
  return res.status(200).send({ message: 'Comments Route' });
});
module.exports = app;
