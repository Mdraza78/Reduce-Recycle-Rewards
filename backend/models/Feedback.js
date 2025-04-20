const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  workerId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  problem: { type: String, required: true },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);