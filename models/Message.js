import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  content: String,
  from: Object,
  socketId: String,
  time: String,
  date: String,
  to: String,
});

export default model('Message', messageSchema);
