import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import chatRoomRouter from './router/chatRoomRouter.js';
import authRouter from './router/authRouter.js';

const app = express();

const PORT = process.env.PORT || config.get('port');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(fileUpload({})); //для работы с файлами

app.use('/auth', authRouter);
app.use('/api', chatRoomRouter);

async function startApp() {
  try {
    await mongoose.connect(config.get('db_url'), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}...`));
  } catch (e) {
    console.log(e);
  }
}
startApp();
