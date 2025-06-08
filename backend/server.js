//1.
const express = require('express')

//chat
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');

const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000


connectDB()
const app = express()

//enable request body as json and url encoded
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/items',require('./routes/itemRoutes'))
app.use('/api/users',require('./routes/userRoutes'))
app.use('/api/listings',require('./routes/listingRoutes'))
app.use('/api/messages',require('./routes/messageRoutes'))
app.use('/api/chats',require('./routes/chatRoutes'))
app.use('/api/auth',require('./routes/authRoutes'))
app.use(errorHandler)


// chat
//creates a Socket.IO server instance attached to your Express HTTP server.
// The cors configuration:
// Allows the Socket.IO client from a different origin (like your mobile app) to connect.
// Without this, you'd get CORS errors when your app tries to connect to the socket server.
const server = http.createServer(app);
const io = new Server(server, {//io is your Socket.IO server instance.
  cors: {
    origin: '*',//allow any frontend origin to connect
    methods: ['GET', 'POST'] // allow this http methods over CORS
  }
});


// Auth middleware
io.use((socket, next) => {
  console.log('auth middleware');
  const token = socket.handshake.auth.token;
  console.log(`auth middleware token ${token}`);
  if (!token) return next(new Error('No token'));
  try {
      console.log(`auth middleware decode start`);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`auth middleware id ${decoded.id}`);
      socket.userId = decoded.id;
      next();
  } catch (err) {
      next(new Error('Auth failed'));
  }

    // const userId = socket.handshake.auth.userId;
    // if (!userId) {
    //   return next(new Error('No userId provided'));
    // }
    // socket.userId = userId;
    // next();
});


// Socket handlers
io.on('connection', (socket) => {
  console.log('User Socket Io connected:', socket.userId);

    //socket.userId = '683baea3c5b53f9905bd28fa';//temporary.. later delete this line //683baa594ff5279bf1aaebc2

    socket.on('joinChat', async ({ listingId, receiverId }) => {
        console.log(`join chat in server.js`)

        let chat = await Chat.findOne({
        listingId,
        $or: [
            { buyerId: socket.userId, sellerId: receiverId },
            { buyerId: receiverId, sellerId: socket.userId }
        ]
        });

      if (!chat) {
        chat = await Chat.create({
          listingId,
          buyerId: socket.userId,
          sellerId: receiverId
        });
      }

    socket.join(chat._id.toString());
    socket.emit('chatJoined', { chatId: chat._id });
  });

  socket.on('sendMessage', async ({ chatId, message }) => {
    const msg = await Message.create({
      chatId,
      senderId: socket.userId,
      message
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message, updatedAt: new Date() });

    io.to(chatId).emit('newMessage', {
      _id: msg._id,
      chatId,
      senderId: socket.userId,
      message,
      createdAt: msg.createdAt
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});


//app.listen(port,()=> console.log(`server already started ${port}`))
server.listen(port, () => console.log(`🚀 Server + Socket.IO running on port ${port}`));
