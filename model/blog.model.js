const mongoose = require('mongoose');
const file = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: { type: String, require: true },
  body: { type: String, require: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  avatar: { type: String, require: true },
};
const BlogSchema = new mongoose.Schema(file, {
  versionKey: false,
  timestamps: true,
});
const BlogModel = mongoose.model('blog', BlogSchema);
module.exports = BlogModel;
