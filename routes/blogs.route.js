require('dotenv').config();
const { Router } = require('express');
const BlogModel = require('../model/blog.model');
const app = Router();
const jwt = require('jsonwebtoken');
const CommentsModel = require('../model/comments.model');
const { useParams } = require('react-router-dom');

let JWT_KEY = process.env.JWT_KEY;
app.post('/post-blog', async (req, res) => {
  const { title, body, image } = req.body;
  try {
    const token = req.headers.authorization;

    let x = jwt.verify(token, JWT_KEY);

    await BlogModel.create({
      title: title,
      userId: x.userId,
      body: body,
      likes: [],
      comments: [],
      avatar: image,
    });
    return res.status(201).send({ message: 'Blog Successfully added' });
  } catch (er) {
    return res.status(400).send({ message: er.message });
  }
});

app.get('/all-blogs', async (req, res) => {
  try {
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
    const getAlll = await BlogModel.findOne({ _id: id }).populate([
      { path: 'userId', select: ['username', 'birthdate'] },
      { path: 'comments', populate: { path: 'userId', select: ['username'] } },
    ]);

    return res.status(200).send(getAlll);
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});

app.delete('/delete-blog/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let x = await BlogModel.findByIdAndDelete({ _id: id });

    if (x.comments.length > 0) {
      await CommentsModel.deleteMany({
        _id: {
          $in: x.comments,
        },
      });
      return res.status(201).send({ message: 'Blog deleted Successfull' });
    }
    return res.status(201).send({ message: 'Blog deleted Successfull' });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});
app.patch('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body, image } = req.body;
  try {
    await BlogModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        avatar: image,
        body,
      },
      {
        new: true,
      }
    );
    return res.status(201).send({ message: 'Successfully edited' });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});

app.patch('/add-like', async (req, res) => {
  const { blogId } = req.body;
  const token = req.headers.authorization;
  //he ^ is the one who liks the blog

  let { userId } = jwt.verify(token, JWT_KEY);

  try {
    let getBlogLikes = await BlogModel.findOne({
      _id: blogId,
      likes: { $in: userId },
    });
    if (getBlogLikes) {
      await BlogModel.findByIdAndUpdate(
        { _id: blogId },
        {
          $pop: { likes: 1 },
        },
        {
          new: true,
        }
      );
      return res.status(201).send({ message: 'Already Liked' });
    }
    await BlogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        $push: { likes: userId },
      },
      {
        new: true,
      }
    );
    return res.status(201).send({ message: 'Like Increased' });
  } catch (er) {
    return res.status(500).send({ message: er.message });
  }
});

module.exports = app;
