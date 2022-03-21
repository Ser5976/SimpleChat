import Router from 'express';
import chatRoomController from '../controller/chatRoomController.js';

const chatRoomRouter = new Router();

chatRoomRouter.post('/chatRoom', chatRoomController.create);

export default chatRoomRouter;
