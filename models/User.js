import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    newMessage: { type: Object, default: {} },
    status: {
      type: String,
      default: 'online',
    },
  },
  { minimize: false }
  // { timestamps: true }
);

export default model('User', userSchema);
