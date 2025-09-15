import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// Store online users
const onlineUsers = new Map();

// Routes
app.post('/api/users/join', (req, res) => {
  const { username } = req.body;
  
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Check if username is already taken
  const userExists = Array.from(onlineUsers.values()).some(user => user.username === username.trim());
  
  if (userExists) {
    return res.status(409).json({ error: 'Username is already taken' });
  }

  res.json({ 
    success: true, 
    username: username.trim(),
    message: 'Successfully joined the chat' 
  });
});

app.get('/api/users/online', (req, res) => {
  const users = Array.from(onlineUsers.values());
  res.json({ users });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  // Typing indicator
  socket.on('user_typing', ({ username }) => {
    socket.broadcast.emit('user_typing', { username })
  })

  socket.on('user_stop_typing', ({ username }) => {
    socket.broadcast.emit('user_stop_typing', { username })
  })
  // Typing indicator
  socket.on('user_typing', ({ username }) => {
    // Broadcast to all except sender
    socket.broadcast.emit('user_typing', {
      username,
      timestamp: new Date().toISOString()
    });
  });
  console.log('User connected:', socket.id);

  socket.on('user_joined', (userData) => {
    const { username } = userData;
    
    // Store user info
    onlineUsers.set(socket.id, {
      id: socket.id,
      username,
      joinedAt: new Date().toISOString()
    });

    // Notify all clients about the new user
    socket.broadcast.emit('user_joined_notification', {
      username,
      content: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
      type: 'system'
    });

    // Send updated online users list to all clients
    io.emit('online_users_updated', {
      users: Array.from(onlineUsers.values())
    });

    console.log(`User ${username} joined the chat`);
  });

  socket.on('send_message', (messageData) => {
    const user = onlineUsers.get(socket.id);
    
    if (user) {
      const message = {
        id: Date.now() + Math.random(),
        username: user.username,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        type: 'user'
      };

      // Broadcast message to all connected clients
      io.emit('receive_message', message);
      console.log(`Message from ${user.username}: ${messageData.content}`);
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    
    if (user) {
      // Remove user from online users
      onlineUsers.delete(socket.id);

      // Notify all clients about user leaving
      socket.broadcast.emit('user_left_notification', {
        username: user.username,
        content: `${user.username} left the chat`,
        timestamp: new Date().toISOString(),
        type: 'system'
      });

      // Send updated online users list to all clients
      io.emit('online_users_updated', {
        users: Array.from(onlineUsers.values())
      });

      console.log(`User ${user.username} left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend should connect to http://localhost:${PORT}`);
});