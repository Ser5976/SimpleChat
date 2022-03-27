import { ROOT_URL } from './../constanst/url';
import React from 'react';
import { io } from 'socket.io-client';

//типизация контекста
/* type ContextType = {
  socket: any;
  rooms: string[];
  setRooms: any;
  currentRoom: string[];
  setCurrentRom: any;
  members: string[];
  setMembers: any;
  messages: string[];
  setMessages: any;
  privateMemberMsg: {};
  setPrivateMemberMsg: any;
  newMessage: {};
  setNewMessage: any;
}; */

export const socket = io(ROOT_URL);

export const AppContext = React.createContext<any>(null);
