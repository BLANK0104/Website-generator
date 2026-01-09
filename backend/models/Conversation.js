const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  currentWebsite: {
    html: String,
    css: String,
    javascript: String,
    description: String,
    content: Object // stores the business content
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversationSchema);
