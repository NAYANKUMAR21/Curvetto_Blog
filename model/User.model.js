const mongoose = require('mongoose');
const file = {
  name: { type: String },
  username: {
    type: String,
    unique: [true, 'Please enter unique username'],
    require: [true, 'Do not leave username feilds empty'],
  },
  password: {
    type: String,
    require: [true, 'Do not leave username feilds empty'],
    minlength: 5,
  },
  birthdate: { type: Date, require: true },
};

const UserSchema = new mongoose.Schema(file, {
  versionKey: false,
  timestamps: true,
});
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
