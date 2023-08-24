const mongoose = require('mongoose');
const file = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  text: { type: String, require: true },
  likes: { type: Number },
};
const CommentsSchema = new mongoose.Schema(file, {
  versionKey: false,
  timestamps: true,
});
const CommentsModel = mongoose.model('comments', CommentsSchema);
module.exports = CommentsModel;
