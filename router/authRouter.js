import Router from 'express';
import { check } from 'express-validator'; // для валидации реквеста
import { authMiddleware } from '../middleware/authMiddleware.js';
import authController from '../controller/authController.js';

const authRouter = new Router();

authRouter.post(
  '/registration',
  [
    check('login', 'Нет имени').trim().isLength({ min: 1 }), //от пустой строки
    check('email', 'Некоректный email').isEmail(),
    check(
      'password',
      'Пороль должен быть больше 3 и меньше 8 символов'
    ).isLength({ min: 4, max: 8 }),
  ],
  authController.registration
);
authRouter.post('/login', authController.login);
authRouter.get('/users', authController.getUsers);
authRouter.delete('/users/:id', authController.delete);
authRouter.get('/check', authMiddleware, authController.checkToken);

export default authRouter;
