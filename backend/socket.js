const jwt = require('jsonwebtoken');
const User = require('./models/User');

const initializeSocket = (httpServer) => {
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user._id})`);

    // Set user as online
    socket.user.isOnline = true;
    socket.user.lastSeen = new Date();
    socket.user.save();

    // Join a chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.user.username} joined chat ${chatId}`);
    });

    // Leave a chat room
    socket.on('leaveChat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user.username} left chat ${chatId}`);
    });

    // Send a message
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, chatModel, content, attachment, codeSnippet, replyTo } = data;

        // Create new message
        const message = new Message({
          chatId,
          chatModel,
          sender: socket.user._id,
          content,
          attachment: attachment || null,
          codeSnippet: codeSnippet || null,
          replyTo: replyTo || null
        });

        await message.save();

        // Populate sender info for emitting
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar')
          .populate('replyTo', 'content sender')
          .exec();

        // Emit to chat room
        io.to(chatId).emit('message', populatedMessage);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('messageError', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (chatId) => {
      socket.to(chatId).emit('typing', {
        userId: socket.user._id,
        username: socket.user.username
      });
    });

    socket.on('stopTyping', (chatId) => {
      socket.to(chatId).emit('stopTyping', {
        userId: socket.user._id,
        username: socket.user.username
      });
    });

    // Update online status
    socket.on('updateOnlineStatus', (isOnline) => {
      socket.user.isOnline = isOnline;
      socket.user.lastSeen = new Date();
      socket.user.save();

      // Broadcast to user's contacts (in a real app, we'd have a contacts list)
      // For now, we'll just update the user's own status
      socket.emit('onlineStatusUpdated', {
        userId: socket.user._id,
        isOnline: socket.user.isOnline,
        lastSeen: socket.user.lastSeen
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.user._id})`);
      socket.user.isOnline = false;
      socket.user.lastSeen = new Date();
      await socket.user.save();
    });
  });

  return io;
};

module.exports = initializeSocket;