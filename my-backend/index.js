require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const ChatMessage = require('./models/ChatMessage');
const leoProfanity = require('leo-profanity'); // <-- Profanity filter

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For development; restrict in production!
    methods: ['GET', 'POST']
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
    socket.user = user; // Attach user info to socket
    next();
  });
});

io.on('connection', async (socket) => {
  console.log('A user connected:', socket.user?.name || socket.user?.username);

  // Send chat history to the newly connected client
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 }).limit(100).exec();
    socket.emit('chat history', messages);
  } catch (err) {
    console.error('Error fetching chat history:', err);
  }

  // Listen for new chat messages
  socket.on('chat message', async (msg) => {
    if (!socket.user) return;

    try {
      // Filter the message using leo-profanity
      const censoredText = leoProfanity.clean(msg.text);

      const chatMsg = new ChatMessage({
        username: socket.user.name || socket.user.username,
        text: censoredText,
        timestamp: new Date()
      });
      await chatMsg.save();

      // Delete older messages, keep only the latest 50
      const count = await ChatMessage.countDocuments();
      if (count > 50) {
        // Find the oldest messages to delete
        const oldMessages = await ChatMessage.find().sort({ timestamp: 1 }).limit(count - 50);
        const oldIds = oldMessages.map(m => m._id);
        await ChatMessage.deleteMany({ _id: { $in: oldIds } });
      }

      io.emit('chat message', chatMsg);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user?.name || socket.user?.username);
  });
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
