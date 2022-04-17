import bcrypt from 'bcryptjs'; //для хэширование пароля
import jwt from 'jsonwebtoken'; //для  генерации токина
import { validationResult } from 'express-validator'; // валидация реквеста
import config from 'config';
import FileServise from '../FileServise.js'; //класс с методами по созданию и записи файла в папку(static) на диски и удалению файла из папки
import User from '../models/User.js';

// генерация токена
const generateAccessToken = (
  id,
  login,
  email,
  status,
  newMessage,
  avatar = null
) => {
  const payload = {
    id,
    login,
    email,
    status,
    newMessage,
    avatar,
  };
  return jwt.sign(payload, config.get('secret'), { expiresIn: 60 });
};

class authController {
  //регистрация
  async registration(req, res) {
    //console.log(req.body);
    // console.log(req.files);

    try {
      // валидация реквеста,проверяем если массив с ошибками не пустой,выводим ошибки
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { login, password } = req.body;
      //проверка на существование в базе  логина
      const candidate = await User.findOne({ login });

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Пользователь с таким именем уже существует' });
      }
      // кэширование пароля
      const hashPassword = bcrypt.hashSync(password, 7);
      //создание пользователя
      let user;
      //если передаём файл  из клиента(аватарка),запись в базу
      if (req.files) {
        const fileName = FileServise.saveFile(req.files.avatar);
        user = await User.create({
          ...req.body,
          password: hashPassword,
          avatar: fileName,
        });
      } else {
        user = await User.create({ ...req.body, password: hashPassword });
      }

      //генерация JWT токина
      const token = generateAccessToken(
        user._id,
        user.login,
        user.email,
        user.status,
        user.newMessage,
        user.avatar && user.avatar
      );
      // данные на клиент
      return res.json({
        successMessage: 'пользователь зарегистрирован',
        token,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'ошибка регистрации' });
    }
  }
  // авторизация
  async login(req, res) {
    try {
      const { login, password } = req.body;
      // проверка на наличие логина
      const user = await User.findOne({ login });
      // console.log(user);
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${login} не найден` });
      }
      // проверка пароля
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Пароль неверный` });
      }
      user.status = 'online';
      await user.save();
      //генерация JWT токина
      const token = generateAccessToken(
        user._id,
        user.login,
        user.email,
        user.status,
        user.newMessage,
        user.avatar && user.avatar
      );
      // данные на клиент
      return res.json({ successMessage: 'вы авторизованы', token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка авторизации' });
    }
  }
  // получение пользователей
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const count = await User.find().count(); //количество пользователей
      res.json({ users, count });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  //удаление пользователя
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ massage: 'Id не указан' });
      }
      //удаление файла с жесткого диска(папка static)
      const filePath = await User.find({ _id: id });
      // console.log(filePath);
      if (filePath[0].avatar) {
        FileServise.deleteFile(filePath[0].avatar);
      }
      //удаление устройства из базы
      const deleteUser = await User.findByIdAndDelete(id);

      return res.json(deleteUser);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  //проверка пользователя на авторизованность и генерация нового токена
  async checkToken(req, res) {
    try {
      const { user } = req;
      const updatedUser = await User.findById({ _id: user.id }); //чтобы знать актуальные данные по стусу и уведомлениям
      const token = generateAccessToken(
        user.id,
        user.login,
        user.email,
        updatedUser.status,
        updatedUser.newMessage,
        user.avatar && user.avatar
      );
      // данные на клиент
      return res.json({ token });
    } catch (e) {
      console.log(e);
    }
  }
  //непрочитанное уведомление(записываем данные о количестве непрочитанных сообщений )
  async addNotifications(req, res) {
    const { _id, room } = req.body;
    // console.log(req.body);
    try {
      const user = await User.findById({ _id });
      if (user.newMessage[room]) {
        user.newMessage[room] = user.newMessage[room] + 1;
      } else {
        user.newMessage[room] = 1;
      }
      const updateNewMessade = await User.findByIdAndUpdate(
        _id,
        { newMessage: user.newMessage },
        {
          new: true,
        }
      );
      return res.json(updateNewMessade);
    } catch (e) {
      res.status(400).json(e);
    }
  }

  //непрочитанное уведомление(удаляем данные о количестве непрочитанных сообщений )
  async resetNotifications(req, res) {
    console.log(req.body);
    const { _id, room } = req.body;
    try {
      const user = await User.findById({ _id });
      delete user.newMessage[room];
      const updateNewMessade = await User.findByIdAndUpdate(
        _id,
        { newMessage: user.newMessage },
        {
          new: true,
        }
      );
      return res.json(updateNewMessade);
    } catch (e) {
      res.status(400).json(e);
    }
  }
}

export default new authController();
