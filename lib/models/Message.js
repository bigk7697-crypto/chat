import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'chatModel' },
    chatModel: { type: String, required: true, enum: ['PrivateChat', 'GroupChat', 'Channel'] },
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true },
    encrypted: { type: Boolean, default: true },
    attachment: {
      type: {
        url: String,
        filename: String,
        mimetype: String,
        size: Number,
      },
      default: null,
    },
    codeSnippet: {
      type: {
        language: String,
        code: String,
      },
      default: null,
    },
    status: {
      type: {
        sent: { type: Boolean, default: true },
        delivered: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
      },
      default: { sent: true, delivered: false, read: false },
    },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
    forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'status.read': 1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);