require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 8080;
const connect = require('./config/db');
const BlogRouter = require('./routes/blogs.route');
const commentsRouter = require('./routes/comments.route');
const userRouter = require('./routes/user.route');

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.use('/blogs', BlogRouter);
app.use('/comments', commentsRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  return res.status(200).json({ Message: 'Welcome to homw page' });
});

app.listen(PORT, async () => {
  await connect();
  console.log(`Listening on port ${PORT}`);
});
