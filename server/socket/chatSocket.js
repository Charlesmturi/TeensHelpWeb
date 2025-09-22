const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Dangerous keywords that trigger alerts
const DANGER_KEYWORDS = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself'];

const configureChatSocket = (io) => {
  // Authentication middleware for Socket.IO
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

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Update user online status
    User.findByIdAndUpdate(socket.userId, { online: true }, { new: true })
      .then(user => {
        // Notify others about online status
        socket.broadcast.emit('user-online', { 
          userId: socket.userId, 
          user: { _id: user._id, name: user.username, role: user.role }
        });
      })
      .catch(err => console.error('Error updating user status:', err));

    // Join chat room
    socket.on('join-chat', async (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat: ${chatId}`);
    });

    // Leave chat room
    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat: ${chatId}`);
    });

    // Handle new messages
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content } = data;
        
        // Check if chat exists and is active
        const chat = await Chat.findById(chatId);
        if (!chat || chat.status !== 'active') {
          socket.emit('error', { message: 'Chat is not active' });
          return;
        }

        // Verify user is part of this chat
        const isTeenUser = chat.teenUser.toString() === socket.userId;
        const isCounselor = chat.counselor.toString() === socket.userId;
        
        if (!isTeenUser && !isCounselor) {
          socket.emit('error', { message: 'Not authorized for this chat' });
          return;
        }
        
        // Check for dangerous content
        const isDangerous = DANGER_KEYWORDS.some(keyword => 
          content.toLowerCase().includes(keyword)
        );
        
        // Create and save message
        const message = new Message({
          chat: chatId,
          sender: socket.userId,
          content,
          isDangerous,
          messageType: isDangerous ? 'alert' : 'text'
        });
        
        await message.save();
        
        // If dangerous content detected, flag the chat
        if (isDangerous) {
          chat.dangerFlagged = true;
          await chat.save();
          
          // Notify admins/supervisors
          io.emit('danger-alert', {
            chatId,
            message: content,
            timestamp: new Date(),
            userId: socket.userId
          });
        }
        
        // Populate sender info
        await message.populate('sender', 'username role');
        
        // Broadcast message to all users in the chat room
        io.to(chatId).emit('new-message', message);
        
        // Send read receipt
        socket.emit('message-sent', { messageId: message._id });
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user-typing', { 
        userId: socket.userId, 
        typing: true 
      });
    });

    socket.on('typing-stop', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user-typing', { 
        userId: socket.userId, 
        typing: false 
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.userId);
      
      // Update user offline status
      try {
        await User.findByIdAndUpdate(socket.userId, { 
          online: false,
          lastSeen: new Date()
        });
        
        // Notify others about offline status
        socket.broadcast.emit('user-offline', { userId: socket.userId });
      } catch (error) {
        console.error('Error updating user status on disconnect:', error);
      }
    });
  });
};

module.exports = configureChatSocket;