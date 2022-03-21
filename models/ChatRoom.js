import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ChatRoom = new Schema({
  name: { type: String, required: true },
});

export default model('ChatRoom', ChatRoom);
