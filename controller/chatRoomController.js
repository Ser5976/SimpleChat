import ChatRoom from '../models/ChatRoom.js';

class chatRoomController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const chatRoom = await ChatRoom.create({ name });
      res.json(chatRoom);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new chatRoomController();
