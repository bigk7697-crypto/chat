const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'chatModel'
  },
  chatModel: {
    type: String,
    required: true,
    enum: ['PrivateChat', 'GroupChat', 'Channel']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  encrypted: {
    type: Boolean,
    default: true
  },
  // For file attachments
  attachment: {
    type: {
      url: String,
      filename: String,
      mimetype: String,
      size: Number
    },
    default: null
  },
  // For code snippets
  codeSnippet: {
    type: {
      language: String,
      code: String
    },
    default: null
  },
  // Message status tracking
  status: {
    type: {
      sent: { type: Boolean, default: true },
      delivered: { type: Boolean, default: false },
      read: { type: Boolean, default: false }
    },
    default: { sent: true, delivered: false, read: false }
  },
  // For replies
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  // For forwards
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'status.read': 1 });

module.exports = mongoose.model('Message', messageSchema);