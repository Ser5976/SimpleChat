import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import chatRoomRouter from './router/chatRoomRouter.js';
import authRouter from './router/authRouter.js';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';
import User from './models/User.js';

const app = express();

const PORT = process.env.PORT || config.get('port');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(fileUpload({})); //для работы с файлами
app.use(express.static('static'));

app.use('/auth', authRouter);
app.use('/api', chatRoomRouter);

//------------------------------------------------------------------
const rooms = ['general', 'tech', 'finanse'];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['Get', 'POST'],
  },
});

app.get('/rooms', (req, res) => {
  res.json(rooms);
});
//получение последнего сообщения из комнаты
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);

  return roomMessages;
}
//сортировать сообщения по дате
function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}

//сокет соединение
io.on('connection', (socket) => {
  socket.on('new-user', async () => {
    // console.log('событие new-user');
    const members = await User.find(); //получение всех пользователей(участников) по событию 'new-user'
    io.emit('new-user', members);
  });

  socket.on('join-room', async (room) => {
    socket.join(room);
    // console.log(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages);
  });

  //получение сообщения из комнаты
  socket.on('message-rom', async (room, content, sender, time, date) => {
    // console.log('сообщение:', content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    //для сортировки сообщений
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    //отправка сообщения в комнату
    io.to(room).emit('room-messages', roomMessages);

    socket.broadcast.emit('notification', room);
    // console.log(newMessage);
  });

  //выход пользователя из системы
  app.post('/auth/logout', async (req, res) => {
    // console.log(req.body);
    try {
      const { _id, newMessage } = req.body;
      const user = await User.findById({ _id });
      console.log(user);
      user.status = 'offline';
      user.newMessage = newMessage;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit('new-user', members);
      // console.log('вы вышли из чата');
      res.json('вы вышли из чата');
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Что-то пошло не так' });
    }
  });
});

//----------------------------------------------------------------------------

async function startApp() {
  try {
    await mongoose.connect(
      config.get('db_url'),
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
      },
      () => {
        console.log(' mongodb подключено ');
      }
    );
    server.listen(PORT, () => console.log(`Сервер запущен на ${PORT}...`));
  } catch (e) {
    console.log(e);
  }
}
startApp();
