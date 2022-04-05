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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['Get', 'POST'],
  },
});

//функция,которая динамически делает сортировку данных из модели Message
//группирует все данные в массив ,состоящий из  обЪектов [{_id:date,messagesByDate:[{}]}]
// в _id лежит дата, а messagesByDate всё остальное, то есть объединяет все данные по дате,
//следующая дата -это уже другой объект
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);
  // console.log(roomMessages);
  return roomMessages;
}
//сортировать сообщения по дате (ранняя дата сверху)
function sortRoomMessagesByDate(messages) {
  messages.map((m) => console.log(m._id));
  return messages.sort(function (a, b) {
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[1] + date1[0] + date1[2];
    date2 = date2[1] + date2[0] + date2[2];

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
    socket.join(room); //присоединить комнату
    //socket.leave(previousRoom); // выйти из комнаты комнату
    // console.log(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // console.log('сортированный', roomMessages);
    socket.emit('room-messages', roomMessages);
  });

  //получение сообщения от клиента в комнату
  socket.on('message-rom', async (room, content, user, time, date) => {
    //  console.log('сообщение:', room);
    const newMessage = await Message.create({
      content,
      from: user,
      time,
      date,
      to: room,
    });
    //для сортировки сообщений
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);

    //отправка сообщения в комнату
    io.to(room).emit('room-messages', roomMessages);
    // событие запустит создание уведомления,что есть сообщение
    socket.broadcast.emit('notifications', room);
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
