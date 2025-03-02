const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Make password optional for OAuth users
  mobile: { type: String, match: /^[0-9]{10}$/ }, // Make mobile optional
  isOAuthUser: { type: Boolean, default: false }, // Add a flag for OAuth users
});

// 🔹 Hash password before saving (only if password is provided)
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);